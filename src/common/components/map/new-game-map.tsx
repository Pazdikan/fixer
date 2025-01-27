import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import axios from "axios";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import * as turf from "@turf/turf";
import { Progress } from "@/common/components/ui/progress";
import {
  DialogContent,
  DialogTitle,
  Dialog,
} from "@/common/components/ui/dialog";
import { Label } from "@/common/components/ui/label";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import { SearchIcon } from "lucide-react";
import { PremadeLocationsDropdown } from "./premade-locations";
import { useToast } from "@/hooks/use-toast";
import { useGame } from "@/core/store/game-store";

export interface Building {
  lat: number;
  lon: number;
  id: string;
  street?: string;
  housenumber?: string;
  connectedIds?: string[];
  amenity?: string;
}

interface ProcessingStatus {
  processed: number;
  total: number;
  stage: string;
  eta?: string;
}

const CONNECT_BUILDINGS = false;
const BATCH_SIZE = 100;
const WAYS_LIMIT = 200000;

function SaveGameplayAreaButton({
  buildings,
  setIsSaved,
}: {
  buildings: Building[];
  setIsSaved: (value: boolean) => void;
}) {
  const map = useMap();
  const updateGameState = useGame((state) => state.updateGameState);
  const { toast } = useToast();

  return (
    buildings.length > 0 && (
      <Button
        style={{
          position: "absolute",
          top: "10px",
          right: "50px",
          zIndex: 1000,
        }}
        onClick={() => {
          if (buildings.length === 0) {
            toast({
              title: "No buildings selected",
              description: "Please select a gameplay area with buildings.",
              variant: "destructive",
            });
            return;
          }

          if (buildings.length < 500) {
            toast({
              title: "Too few buildings",
              description: "Please select a larger gameplay area.",
              variant: "destructive",
            });
            return;
          }

          const bounds = map.getBounds();

          updateGameState({
            world: {
              bounding_box: [
                bounds.getSouth(),
                bounds.getWest(),
                bounds.getNorth(),
                bounds.getEast(),
              ],
              buildings: buildings,
            },
          });

          setIsSaved(true);
        }}
      >
        Save gameplay araa
      </Button>
    )
  );
}

function SearchControl() {
  const [searchQuery, setSearchQuery] = useState("");
  const map = useMap();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        map.flyTo([parseFloat(lat), parseFloat(lon)], 18, {
          duration: 2,
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex"
      style={{
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        padding: "5px",
        borderRadius: "4px",
        gap: "8px",
      }}
    >
      <Input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Find location..."
      ></Input>
      <Button type="submit">
        <SearchIcon size={16} />
      </Button>
    </form>
  );
}

const DrawControl: React.FC<{
  onBoundsSelected: (bounds: number[]) => void;
}> = ({ onBoundsSelected }) => {
  const map = useMap();

  useEffect(() => {
    const drawControl = new L.Control.Draw({
      draw: {
        polygon: false,
        polyline: false,
        circle: false,
        circlemarker: false,
        marker: false,
        rectangle: {
          shapeOptions: {
            color: "#0000FF",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.2,
          },
          metric: true,
          showArea: false,
        },
      },
      // edit: { featureGroup: new L.FeatureGroup() },
    });

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    map.addControl(drawControl);

    const handleCreated = (e: any) => {
      const bounds = e.layer.getBounds();
      const selectedBounds = [
        bounds.getSouth(),
        bounds.getWest(),
        bounds.getNorth(),
        bounds.getEast(),
      ];

      onBoundsSelected(selectedBounds);

      drawnItems.clearLayers();
      drawnItems.addLayer(e.layer);
    };

    map.on(L.Draw.Event.CREATED, handleCreated);
    map.on(L.Draw.Event.DRAWSTART, () => drawnItems.clearLayers());

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.off(L.Draw.Event.DRAWSTART);
    };
  }, [map, onBoundsSelected]);

  return null;
};

export const GameMap: React.FC = ({
  isNewGameCreator = false,
}: {
  isNewGameCreator: boolean;
}) => {
  const gameState = useGame((state) => state.gameState);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBounds, setSelectedBounds] = useState<number[] | null>(
    gameState.world?.bounding_box ?? null
  );
  const [status, setStatus] = useState<ProcessingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [_, setStartTime] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  // Handle initial buildings setup
  useEffect(() => {
    if (!isNewGameCreator && gameState.world?.buildings) {
      setBuildings(gameState.world.buildings);
      setSelectedBounds(gameState.world?.bounding_box);
    }
  }, [
    isNewGameCreator,
    gameState.world?.buildings,
    gameState.world?.bounding_box,
  ]);

  // Handle bounds selection
  const handleBoundsSelected = useCallback((bounds: number[]) => {
    setSelectedBounds(bounds);
    setBuildings([]);
  }, []);

  const calculateCentroid = useCallback((nodes) => {
    const coordinates = nodes
      .filter(Boolean)
      .map((node) => [node.lon, node.lat]);
    const centroid = turf.centroid(
      turf.featureCollection(coordinates.map((coord) => turf.point(coord)))
    );
    return {
      lat: centroid.geometry.coordinates[1],
      lon: centroid.geometry.coordinates[0],
    };
  }, []);

  const processBuildings = useCallback(
    async (buildingData: any[]) => {
      return new Promise<Building[]>((resolve) => {
        const ways = buildingData.filter((element) => element.type === "way");
        const nodeToWay = new Map<number, any>();
        const processed = new Set<string>();
        const result: Building[] = [];
        let processedCount = 0;
        const startTime = Date.now();

        ways.forEach((way) => {
          way.nodes.forEach((nodeId: number) => {
            if (!nodeToWay.has(nodeId)) {
              nodeToWay.set(nodeId, new Set([way]));
            } else {
              nodeToWay.get(nodeId)?.add(way);
            }
          });
        });

        const processBatch = (startIdx: number) => {
          const elapsedTime = Date.now() - startTime;
          const progressPercent = processedCount / ways.length;
          const estimatedTotalTime =
            progressPercent > 0 ? elapsedTime / progressPercent : 0;
          const remainingTime = estimatedTotalTime - elapsedTime;
          const minutes = Math.floor(remainingTime / 60000);
          const seconds = Math.floor((remainingTime % 60000) / 1000);
          const etaString = `${minutes}m ${seconds}s remaining`;

          setStatus({
            processed: processedCount,
            total: ways.length,
            stage: "Processing buildings",
            eta: etaString,
          });

          const endIdx = Math.min(startIdx + BATCH_SIZE, ways.length);

          for (let i = startIdx; i < endIdx; i++) {
            const way = ways[i];
            const buildingId = way.id.toString();

            if (processed.has(buildingId)) continue;

            const connectedBuildings = new Set([buildingId]);
            const nodesToCheck = new Set(way.nodes);

            for (const nodeId of nodesToCheck) {
              const connectedWays = nodeToWay.get(nodeId);
              if (connectedWays) {
                for (const connectedWay of connectedWays) {
                  const connectedId = connectedWay.id.toString();
                  if (!connectedBuildings.has(connectedId)) {
                    connectedBuildings.add(connectedId);
                    processed.add(connectedId);
                    connectedWay.nodes.forEach((n: number) =>
                      nodesToCheck.add(n)
                    );
                  }
                }
              }
            }

            const nodes = Array.from(connectedBuildings)
              .map((id) =>
                buildingData.find(
                  (e) => e.type === "way" && e.id.toString() === id
                )
              )
              .filter(Boolean)
              .flatMap((way) =>
                way.nodes.map((nId) =>
                  buildingData.find((e) => e.type === "node" && e.id === nId)
                )
              );

            result.push({
              ...calculateCentroid(nodes),
              id: buildingId,
              connectedIds: Array.from(connectedBuildings),
              housenumber: way.tags?.["addr:housenumber"] ?? null,
              street: way.tags?.["addr:street"] ?? null,
            });

            processedCount++;
          }

          if (endIdx < ways.length) {
            requestAnimationFrame(() => processBatch(endIdx));
          } else {
            setStatus(null);
            resolve(result);
          }
        };

        requestAnimationFrame(() => processBatch(0));
      });
    },
    [calculateCentroid]
  );

  useEffect(() => {
    const fetchBuildings = async () => {
      if (!isNewGameCreator || !selectedBounds) return;

      try {
        setIsLoading(true);
        setStatus({
          processed: 0,
          total: 0,
          stage: "Fetching data",
          eta: "Calculating...",
        });
        setBuildings([]); // Clear existing buildings
        setStartTime(Date.now());

        const overpassQuery = `[out:json];(way["building"](${selectedBounds.join(
          ","
        )}););(._;>;);out body;`;
        const response = await axios.get(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
            overpassQuery
          )}`
        );

        const buildingData: any[] = response.data.elements;

        console.log("Building data:", buildingData.length);

        if (buildingData.length > WAYS_LIMIT) {
          setSelectedBounds(null);
          setStatus(null);
          setIsLoading(false);
          toast({
            title: "Too many buildings",
            description: `The selected area contains too many buildings. Please select a smaller area.`,
            variant: "destructive",
          });
          return;
        }

        if (buildingData.length > 0) {
          if (CONNECT_BUILDINGS) {
            const processed = await processBuildings(buildingData);
            setBuildings(processed);
          } else {
            const startTime = Date.now();
            const ways = buildingData.filter(
              (element) => element.type === "way"
            );
            const buildingsList: Building[] = [];
            const batchSize = 100;

            for (let i = 0; i < ways.length; i += batchSize) {
              const batch = ways.slice(i, i + batchSize);

              const elapsedTime = Date.now() - startTime;
              const progressPercent = i / ways.length;
              const estimatedTotalTime =
                progressPercent > 0 ? elapsedTime / progressPercent : 0;
              const remainingTime = estimatedTotalTime - elapsedTime;
              const minutes = Math.floor(remainingTime / 60000);
              const seconds = Math.floor((remainingTime % 60000) / 1000);
              const etaString = `${minutes}m ${seconds}s remaining`;

              setStatus({
                processed: i,
                total: ways.length,
                stage: "Processing buildings",
                eta: etaString,
              });

              const batchBuildings = batch.map((way) => ({
                ...calculateCentroid(
                  way.nodes.map((id) =>
                    buildingData.find((e) => e.type === "node" && e.id === id)
                  )
                ),
                id: way.id.toString(),
                housenumber: way.tags?.["addr:housenumber"] ?? null,
                street: way.tags?.["addr:street"] ?? null,
                amenity: way.tags?.amenity ?? null,
              }));

              buildingsList.push(...batchBuildings);

              // Allow UI to update
              await new Promise((resolve) => setTimeout(resolve, 0));
            }

            const amenityCount = buildingsList.reduce((acc, building) => {
              if (building.amenity) {
                acc[building.amenity] = (acc[building.amenity] || 0) + 1;
              }
              return acc;
            }, {});

            console.log("Amenity counts:", amenityCount);

            setBuildings(buildingsList);
          }
        }
      } catch (error) {
        console.error("Error fetching buildings:", error);
      } finally {
        setStatus(null);
        setIsLoading(false);
      }
    };

    fetchBuildings();
  }, [isNewGameCreator, selectedBounds]);

  console.log("BBOX:", selectedBounds);

  return (
    <>
      {status && (
        <div style={{ zIndex: 1000 }}>
          <Dialog defaultOpen={true} open={true}>
            <DialogContent>
              <DialogTitle>{status.stage}</DialogTitle>
              <Progress value={(status.processed / status.total) * 100} />
              <Label>
                {status.processed} / {status.total} - Eta: {status.eta}
              </Label>
            </DialogContent>
          </Dialog>
        </div>
      )}
      <MapContainer
        center={
          selectedBounds != null
            ? [
                (selectedBounds[0] + selectedBounds[2]) / 2,
                (selectedBounds[1] + selectedBounds[3]) / 2,
              ]
            : [35.1162096879365, -106.55105352401735]
        }
        minZoom={isNewGameCreator ? 6 : 12}
        zoom={16}
        maxZoom={18}
        style={{
          height: isNewGameCreator ? "500px" : "100%",
          width: isNewGameCreator ? "100%" : "100%",
          margin: "0 auto",
          zIndex: status ? -1 : 1,
          borderRadius: "12px",
          backgroundColor: "#000",
        }}
      >
        {isNewGameCreator && !isSaved && (
          <>
            <PremadeLocationsDropdown
              handleBoundsSelected={handleBoundsSelected}
            />
            <SearchControl />
            <SaveGameplayAreaButton
              buildings={buildings}
              setIsSaved={setIsSaved}
            />
            <DrawControl onBoundsSelected={handleBoundsSelected} />
          </>
        )}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; <a href='https://carto.com/attributions/'>CartoDB</a>"
        />
        {!isLoading && (
          <MarkerClusterGroup
            zoomToBoundsOnClick={true}
            spiderfyOnMaxZoom={false}
            disableClusteringAtZoom={18}
            removeOutsideVisibleBounds={true}
            animate={false}
            animateAddingMarkers={false}
          >
            {buildings
              .filter((b) => !b.amenity)
              .map((building) => (
                <Marker
                  key={building.id}
                  position={[building.lat, building.lon]}
                  icon={L.divIcon({
                    iconSize: [12, 12],
                    className: "leaflet-custom-marker-icon",
                  })}
                >
                  <Popup>
                    {!building.street && !building.housenumber
                      ? "Unknown street"
                      : `${building.street} ${building.housenumber}`}
                  </Popup>
                </Marker>
              ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>
    </>
  );
};
