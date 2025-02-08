import { KnownFields } from "@/core/core.types";
import { useGame } from "@/core/store/game-store";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Check if a field is known for an entity
export function isFieldKnown(
  entityType: keyof KnownFields,
  entityId: string,
  field: string
): boolean {
  const gameState = useGame.getState().gameState;

  const entityFields = gameState.knownFields?.[entityType]?.[entityId];
  return entityFields ? entityFields.includes(field) : false;
}

// Mark a field as discovered for an entity
export function discoverField(
  entityType: keyof KnownFields,
  entityId: string,
  field: string
): void {
  const gameState = useGame.getState().gameState;
  const updateGameState = useGame.getState().updateGameState;

  if (!gameState.knownFields) {
    updateGameState({
      knownFields: {
        characters: {},
        companies: {},
        world: {},
      },
    });
  }

  const entityFields = gameState.knownFields[entityType][entityId] || [];
  if (!entityFields.includes(field)) {
    gameState.knownFields[entityType][entityId] = [...entityFields, field];
    updateGameState({
      knownFields: {
        ...gameState.knownFields,
        [entityType]: {
          ...gameState.knownFields[entityType],
          [entityId]: [...entityFields, field],
        },
      },
    });
  }
}
