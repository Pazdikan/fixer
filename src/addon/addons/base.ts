import { Addon, Flags } from "../addon";

import first_names_male from "@/../data/first_names_male.json";
import first_names_female from "@/../data/first_names_female.json";
import last_names from "@/../data/last_names.json";
import { Gender } from "@/character/character.types";
import { IAPI } from "@/api/api";

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

    register_achievements(api);

    api.event.on("tick", () => {
      console.log("Core addon ticked!");
    });
  },
  onDisabled: () => {
    // Usually, here you would remove all registered stuff from onEnabled,
    // but this is the core addon and should never be disabled.
    throw new Error(
      "Core addon has been disabled! This is unexpected. Please refresh the page."
    );
  },
};

function register_achievements(api: IAPI) {
  api.achievement.register({
    id: "create_character",
    name: "Roleplayer",
    description: "Create your own character.",
  });

  api.achievement.register({
    id: "recruit_people",
    name: "Rectruiter",
    description: "Recruit 10 people to your team.",
    target: 10,
  });
}
