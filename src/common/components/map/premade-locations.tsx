import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";

import { useMap } from "react-leaflet";

export type PremadeLocation = {
  name: string;
  description: string;
  size: string;
  bbox: number[];
};

const premadeLocations: PremadeLocation[] = [
  {
    name: "Dickinson, ND",
    description: "Dick in son",
    size: "Small",
    bbox: [
      46.84160801478844, -102.89846420288087, 46.94183354371819,
      -102.72302627563478,
    ],
  },
  {
    name: "Hurricane, UT",
    description: "Freddy Fazbear's Pizza",
    size: "Medium",
    bbox: [
      37.100544306918536, -113.41787338256837, 37.20210941407132,
      -113.27608108520509,
    ],
  },
  {
    name: "Salem, MA",
    description: "The greatest technician that's ever lived",
    size: "Large",
    bbox: [
      42.495849584574245, -70.91597557067873, 42.53724216683395,
      -70.86379051208498,
    ],
  },
];

export function PremadeLocationsDropdown({
  handleBoundsSelected,
}: {
  handleBoundsSelected: (bbox: number[]) => void;
}) {
  const map = useMap();

  const [selectedLocation, setSelectedLocation] =
    useState<PremadeLocation | null>(null);

  useEffect(() => {
    if (selectedLocation) {
      map.flyToBounds([
        [selectedLocation.bbox[0], selectedLocation.bbox[1]],
        [selectedLocation.bbox[2], selectedLocation.bbox[3]],
      ]);

      handleBoundsSelected(selectedLocation.bbox);
    }
  }, [selectedLocation]);

  return (
    <div
      className="flex"
      style={{
        position: "absolute",
        top: "60px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        padding: "5px",
        borderRadius: "4px",
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[342px] justify-between">
            {selectedLocation ? selectedLocation.name : "Premade locations"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[342px]" style={{ zIndex: 1000 }}>
          {premadeLocations.map((location) => (
            <DropdownMenuItem
              key={location.name}
              onSelect={() => {
                setSelectedLocation(location);
                handleBoundsSelected(location.bbox);
              }}
              className="gap-8 cursor-pointer h-28"
            >
              <div className="flex flex-col">
                <span className="font-medium">{location.name}</span>
                <span className="text-sm text-muted-foreground">
                  {location.description}
                </span>
                <span className="text-xs text-muted-foreground">
                  Size: {location.size}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
