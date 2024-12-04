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

interface Building {
  lat: number;
  lon: number;
  id: string;
  connectedIds?: string[];
}

interface ProcessingStatus {
  processed: number;
  total: number;
  stage: string;
  eta?: string;
}

const CHOOSING_NEW_GAME_LOCATION = false;
const bbox = [
  35.11653865167174, -106.56888484954835, 35.160477068693496,
  -106.4984178543091,
];
const CONNECT_BUILDINGS = true;
const BATCH_SIZE = 100;

function SaveGameplayAreaButton() {
  return (
    <Button
      onClick={() => {
        // Save the gameplay area
      }}
    >
      Save gameplay arat
    </Button>
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
        map.flyTo([parseFloat(lat), parseFloat(lon)], 13, {
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
      edit: { featureGroup: new L.FeatureGroup() },
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

export const NewGameMap: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBounds, setSelectedBounds] = useState<number[]>(bbox);
  const [status, setStatus] = useState<ProcessingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [_, setStartTime] = useState<number | null>(null);
  const BUILDING_LIMIT = 1000000;
  const [isSaved, setIsSaved] = useState(false);

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
        )}););(._;>;);out skel;`;
        const response = await axios.get(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
            overpassQuery
          )}`
        );

        const buildingData: any[] = response.data.elements;

        if (buildingData.length > BUILDING_LIMIT) {
          setSelectedBounds(bbox);
          setStatus(null);
          setIsLoading(false);
          return;
        }

        if (buildingData.length > 0) {
          if (CONNECT_BUILDINGS) {
            const processed = await processBuildings(buildingData);
            // Only set buildings once processing is complete
            setBuildings(processed);
          } else {
            const buildingsList = buildingData
              .filter((element) => element.type === "way")
              .map((way) => ({
                ...calculateCentroid(
                  way.nodes.map((id) =>
                    buildingData.find((e) => e.type === "node" && e.id === id)
                  )
                ),
                id: way.id.toString(),
              }));
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
  }, [selectedBounds, processBuildings, calculateCentroid]);

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
      {isSaved && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            zIndex: 2000,
            opacity: 0.8,
          }}
        />
      )}
      <MapContainer
        center={[(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2]}
        zoom={16}
        maxZoom={18}
        style={{
          height: "90%",
          width: "90%",
          margin: "0 auto",
          zIndex: status ? -1 : 1,
        }}
      >
        <SearchControl />
        <SaveGameplayAreaButton
          visible={!status && !isSaved && buildings.length > 0}
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; <a href='https://carto.com/attributions/'>CartoDB</a>"
        />
        <DrawControl onBoundsSelected={handleBoundsSelected} />
        {!isLoading && (
          <MarkerClusterGroup
            zoomToBoundsOnClick={true}
            spiderfyOnMaxZoom={false}
            disableClusteringAtZoom={18}
            removeOutsideVisibleBounds={true}
            animate={false}
            animateAddingMarkers={false}
          >
            {buildings.map((building) => (
              <Marker
                key={building.id}
                position={[building.lat, building.lon]}
                icon={L.divIcon({
                  iconSize: [12, 12],
                  className: "leaflet-custom-marker-icon",
                })}
              >
                <Popup>
                  {CONNECT_BUILDINGS ? (
                    <>
                      Building Group {building.id}
                      <br />
                      Connected: {building.connectedIds?.join(", ") || "None"}
                    </>
                  ) : (
                    `Building ${building.id}`
                  )}
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>
    </>
  );
};
