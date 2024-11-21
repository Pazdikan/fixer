import { Addon, Flags } from "../addon";

import first_names_male from "@/../data/first_names_male.json";
import first_names_female from "@/../data/first_names_female.json";
import last_names from "@/../data/last_names.json";
import { Gender } from "@/character/character.types";

export const coreAddon: Addon = {
  id: "core",
  name: "Core",
  description: "The core addon for the game.",
  version: "0.1.0",
  flags: [Flags.CORE],
  onEnabled: (api) => {
    console.log("Core addon enabled!");

    api.character.addFirstNamesToGenerator(first_names_male, Gender.MALE);
    api.character.addFirstNamesToGenerator(first_names_female, Gender.FEMALE);
    api.character.addLastNamesToGenerator(last_names);
  },
  onDisabled: () => {
    throw new Error(
      "Core addon has been disabled! This is unexpected. Please refresh the page."
    );
  },
};
