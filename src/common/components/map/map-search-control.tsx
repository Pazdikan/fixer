import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { useMap } from "react-leaflet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

/**
 * A search control component for map that enables location search functionality.
 * Uses OpenStreetMap's Nominatim service for geocoding and provides smooth map navigation to found locations.
 *
 * @returns A form component with search input and submit button, positioned absolutely on the map.
 */
export function SearchControl() {
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
