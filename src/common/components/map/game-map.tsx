import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import { Button } from "@/common/components/ui/button";
import { PremadeLocationsDropdown } from "./premade-locations";
import { useToast } from "@/hooks/use-toast";
import { useGame } from "@/core/store/game-store";
import { DrawControl } from "./map-draw-control";
import { SaveGameplayAreaButton } from "./save-gameplay-area";
import { SearchControl } from "./map-search-control";
import { Card, CardContent } from "../ui/card";
import { XIcon } from "lucide-react";
import { api } from "@/api/api";

export interface Building {
  tags?: string[];
  lat: number;
  lon: number;
  id: string;
  street?: string;
  housenumber?: string;
  city?: string;
  amenity?: string;
}

export interface ProcessingStatus {
  processed: number;
  total: number;
  stage: string;
  eta?: string;
}

const BATCH_SIZE = 100;
const ELEMENTS_LIMIT = 30000;

const BuildingMarker = ({ building, setSelectedBuilding }) => {
  return (
    <Marker
      key={building.id}
      position={[building.lat, building.lon]}
      icon={L.divIcon({
        iconSize: [12, 12],
        className: "leaflet-marker",
      })}
      eventHandlers={{
        click: () => setSelectedBuilding(building),
      }}
    />
  );
};

const PopupReplacement = ({ building, closePopup, isNewGameCreator }) => {
  const map = useMap();
  const { gameState, updateGameState } = useGame();
  if (!building) return null;

  // Convert lat/lon to pixel coordinates
  const point = map.latLngToContainerPoint([building.lat, building.lon]);

  return (
    <div
      className="absolute z-[2000]"
      style={{
        left: point.x,
        top: point.y,
        transform: "translate(-50%, -100%)",
      }}
    >
      <Card className="w-[300px] shadow-lg">
        <Button
          variant={"ghost"}
          onClick={closePopup}
          className="right-0 float-right w-8 h-8 p-0 m-2"
        >
          <XIcon size={16} className="text-white" />
        </Button>

        <CardContent className="p-4 flex flex-col gap-2">
          <p className="font-semibold text-lg">
            {!building.street && !building.housenumber
              ? "Unknown address"
              : `${building.street} ${building.housenumber}${
                  building.city ? `, ${building.city}` : ""
                }`}
          </p>
          <p>Type: {building.amenity || "House"}</p>
          {isNewGameCreator && !gameState.world?.player_base_id && (
            <Button
              onClick={() => {
                const updatedBuilding = api.util.addTag(
                  building,
                  "known:location"
                );

                updateGameState({
                  world: {
                    ...gameState.world,
                    player_base_id: building.id,
                    buildings: gameState.world.buildings.map((b) =>
                      b.id === building.id ? updatedBuilding : b
                    ),
                  },
                });
              }}
            >
              Choose As Your Base
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const GameMap: React.FC<{ isNewGameCreator?: boolean }> = ({
  isNewGameCreator = false,
}) => {
  const gameState = useGame((state) => state.gameState);
  const debugRevealMap = gameState.debug.revealMap;
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [knownBuildings, setKnownBuildings] = useState<Building[]>([]);
  const [selectedBounds, setSelectedBounds] = useState<number[] | null>(
    gameState.world?.bounding_box ?? null
  );
  const [status, setStatus] = useState<ProcessingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [mapKey, setMapKey] = useState(0);

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

  const handleBoundsSelected = useCallback((bounds: number[]) => {
    setSelectedBounds(bounds);
    setBuildings([]);
  }, []);

  const calculateCentroid = useCallback((coordinates: number[][]) => {
    const centroid = turf.centroid(
      turf.featureCollection(coordinates.map((coord) => turf.point(coord)))
    );
    return {
      lat: centroid.geometry.coordinates[1],
      lon: centroid.geometry.coordinates[0],
    };
  }, []);

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
        setBuildings([]);
        const startTime = Date.now();

        const overpassQuery = `[out:json][timeout:25];(nwr["addr:housenumber"](${selectedBounds.join(
          ","
        )}););out geom;`;
        const response = await axios.get(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
            overpassQuery
          )}`
        );

        const buildingData = response.data.elements;

        if (buildingData.length > ELEMENTS_LIMIT) {
          setSelectedBounds(null);
          setStatus(null);
          setIsLoading(false);
          toast({
            title: "Too many elements",
            description: `The selected area contains too many addresses. Please select a smaller area.`,
            variant: "destructive",
          });
          return;
        }

        const nodes = buildingData.filter((e) => e.type === "node");
        const ways = buildingData.filter((e) => e.type === "way");
        const totalElements = nodes.length + ways.length;
        const buildingsList: Building[] = [];

        // Process nodes
        const nodeBuildings = nodes.map((node) => ({
          lat: node.lat,
          lon: node.lon,
          id: `node-${node.id}`,
          housenumber: node.tags?.["addr:housenumber"],
          street: node.tags?.["addr:street"],
          city: node.tags?.["addr:city"],
          amenity: node.tags?.amenity,
        }));
        buildingsList.push(...nodeBuildings);

        setStatus({
          processed: nodes.length,
          total: totalElements,
          stage: "Processing elements",
          eta: "Calculating...",
        });

        // Process ways in batches
        for (let i = 0; i < ways.length; i += BATCH_SIZE) {
          const batch = ways.slice(i, i + BATCH_SIZE);
          const wayBuildings = batch.map((way) => {
            const coordinates = way.geometry.map(
              (p: { lon: number; lat: number }) => [p.lon, p.lat]
            );
            const centroid = calculateCentroid(coordinates);
            return {
              ...centroid,
              id: `way-${way.id}`,
              housenumber: way.tags?.["addr:housenumber"],
              street: way.tags?.["addr:street"],
              amenity: way.tags?.amenity,
            };
          });
          buildingsList.push(...wayBuildings);

          const processedCount = nodes.length + i + batch.length;
          const elapsedTime = Date.now() - startTime;
          const progressPercent = processedCount / totalElements;
          const estimatedTotalTime =
            progressPercent > 0 ? elapsedTime / progressPercent : 0;
          const remainingTime = estimatedTotalTime - elapsedTime;
          const etaString = `${Math.floor(remainingTime / 60000)}m ${Math.floor(
            (remainingTime % 60000) / 1000
          )}s remaining`;

          setStatus({
            processed: processedCount,
            total: totalElements,
            stage: "Processing elements",
            eta: etaString,
          });

          await new Promise((resolve) => setTimeout(resolve, 0));
        }

        const amenityCount = buildingsList.reduce(
          (acc: Record<string, number>, building) => {
            if (building.amenity) {
              acc[building.amenity] = (acc[building.amenity] || 0) + 1;
            }
            return acc;
          },
          {}
        );

        setBuildings(buildingsList);
      } catch (error) {
        console.error("Error fetching buildings:", error);
        toast({
          title: "Error fetching data",
          description: "Failed to retrieve map data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setStatus(null);
        setIsLoading(false);
      }
    };

    fetchBuildings();
  }, [isNewGameCreator, selectedBounds, calculateCentroid, toast]);

  const filteredBuildings = useMemo(() => {
    return buildings.filter(
      (b) =>
        isNewGameCreator ||
        debugRevealMap ||
        api.util.hasTag(b, "known:location")
    );
  }, [buildings, isNewGameCreator, debugRevealMap]);

  return (
    <>
      {status && (
        <div style={{ zIndex: 1000 }}>
          <Dialog defaultOpen open>
            <DialogContent>
              <DialogTitle>{status.stage}</DialogTitle>
              <Progress value={(status.processed / status.total) * 100} />
              <Label>
                {status.processed} / {status.total} - ETA: {status.eta}
              </Label>
            </DialogContent>
          </Dialog>
        </div>
      )}
      <MapContainer
        center={
          selectedBounds
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
          width: "100%",
          margin: "0 auto",
          zIndex: status ? -1 : 1,
          borderRadius: "12px",
          backgroundColor: "#000",
        }}
      >
        {isNewGameCreator && (
          <>
            <PremadeLocationsDropdown
              handleBoundsSelected={handleBoundsSelected}
            />
            <SearchControl />
            <SaveGameplayAreaButton buildings={buildings} />
            <DrawControl onBoundsSelected={handleBoundsSelected} />
          </>
        )}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; <a href='https://carto.com/attributions/'>CartoDB</a>"
        />
        {!isLoading && (
          <MarkerClusterGroup
            zoomToBoundsOnClick
            spiderfyOnMaxZoom={false}
            disableClusteringAtZoom={18}
            removeOutsideVisibleBounds
            animate={false}
          >
            {filteredBuildings.map((building) => (
              <BuildingMarker
                key={building.id}
                building={building}
                setSelectedBuilding={setSelectedBuilding}
              />
            ))}
          </MarkerClusterGroup>
        )}
        <PopupReplacement
          building={selectedBuilding}
          closePopup={() => setSelectedBuilding(null)}
          isNewGameCreator={isNewGameCreator}
        />
      </MapContainer>
    </>
  );
};
