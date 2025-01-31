import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const DrawControl: React.FC<{
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
