import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import axios from "axios";
import "react-leaflet-markercluster/dist/styles.min.css";

interface Building {
  lat: number;
  lon: number;
  id: string;
}

const spawnPoint = {
  lat: 51.7432675,
  lon: 19.8098251,
};
const bbox = [
  51.73359346885953, 19.795518264348466, 51.75240697346131, 19.834399790672492,
];

const BuildingMap: React.FC = () => {
  // Set initial state
  const [buildings, setBuildings] = useState<Building[]>([]);

  const calculateCentroid = (nodes: any[]) => {
    const latitudes = nodes.map((node: any) => node.lat);
    const longitudes = nodes.map((node: any) => node.lon);
    const latCenter =
      latitudes.reduce((acc, lat) => acc + lat, 0) / latitudes.length;
    const lonCenter =
      longitudes.reduce((acc, lon) => acc + lon, 0) / longitudes.length;

    return { lat: latCenter, lon: lonCenter };
  };

  useEffect(() => {
    const fetchBuildings = async () => {
      const overpassQuery = `[out:json];(way["building"](${bbox.join(
        ","
      )}););(._;>;);out body;`;
      const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
        overpassQuery
      )}`;

      try {
        const response = await axios.get(overpassUrl);
        const buildingData = response.data.elements;

        if (buildingData.length > 0) {
          const buildingGroups: { [key: string]: any[] } = {};

          buildingData
            .filter((element: any) => element.type === "way")
            .forEach((way: any) => {
              const nodes = way.nodes.map((nodeId: any) =>
                buildingData.find(
                  (element: any) =>
                    element.type === "node" && element.id === nodeId
                )
              );
              const buildingId = way.id.toString();
              if (!buildingGroups[buildingId]) {
                buildingGroups[buildingId] = [];
              }
              buildingGroups[buildingId].push(...nodes);
            });

          const buildingsList = Object.values(buildingGroups).map((nodes) => {
            const centroid = calculateCentroid(nodes);
            return centroid;
          });

          setBuildings(buildingsList);
        } else {
          console.warn("No buildings found in this area");
        }
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };

    fetchBuildings();
  }, [spawnPoint]);

  console.log(buildings.length);

  return (
    <MapContainer
      center={spawnPoint}
      zoom={16}
      maxZoom={18}
      style={{ height: "100%", width: "100%", margin: "0 auto" }}
      bounds={new L.LatLngBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]])}
    >
      <TileLayer
        // url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // CartoDB Dark with labels (terrible fucking colors, you can't see shit)
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // CartoDB Light with labels
        attribution="&copy; <a href='https://carto.com/attributions/'>CartoDB</a>"
      />
      <MarkerClusterGroup
        zoomToBoundsOnClick={true}
        spiderfyOnMaxZoom={false}
        disableClusteringAtZoom={18}
        removeOutsideVisibleBounds={true}
        animate={false}
      >
        {buildings.map((building, index) => (
          <Marker
            key={index}
            position={[building.lat, building.lon]}
            icon={L.divIcon({
              iconSize: [12, 12],
              className: "leaflet-custom-marker-icon", // red dot
            })}
          >
            <Popup>{`Building ${index + 1}`}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default BuildingMap;
