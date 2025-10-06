import { Addon, Flags } from "../addon";

import first_names_male from "@/../data/first_names_male.json";
import first_names_female from "@/../data/first_names_female.json";
import last_names from "@/../data/last_names.json";
import { Gender } from "@/character/character.types";
import { api, IAPI } from "@/api/api";
import { Post } from "@/network/posts/post.types";
import { useGame } from "@/core/store/game-store";
import { getRandomMessage } from "@/network/posts/content";
import { toast } from "@/hooks/use-toast";
import { ToastAction, ToastActionElement } from "@/common/components/ui/toast";
import React from "react";

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

      triggerRandomEvent();
    });

    // Listen for chat messages globally and respond
    api.event.on("chat/messageSent", (event: any) => {
      if (!event.message.isPlayer) return;
      // Respond after a short delay
      setTimeout(() => {
        const responseMsg = {
          id: useGame.getState().gameState.world.time! + 1,
          characterId: event.characterId,
          content: "Hello, I received your message!",
          timestamp: useGame.getState().gameState.world.time!,
          isPlayer: false,
        };
        api.character.addChatMessage(event.characterId, responseMsg);
      }, Math.floor(Math.random() * 3000) + 2000);
    });

    // Message received toast
    api.event.on("chat/messageSent", (event) => {
      if (event.message.isPlayer) return;

      toast({
        title: `Message from ${api.character.getFullName(
          api.character.getCharacterById(event.characterId)!
        )}`,
        description: event.message.content,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
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

function triggerRandomEvent() {
  if (api.generator.rng() < 0.2) return; // prevents triggering an event every trick

  const chance = api.generator.rng();

  if (chance < 0.1) {
    let randomPost = getRandomMessage();

    api.event.trigger({
      type: "networkPost",
      post: {
        author_id: api.character.pickRandom().id,
        content: randomPost.content,
        id: `${new Date().getMilliseconds() * api.generator.rng()}`,
        timestamp: `${api.util.formatTime(
          useGame.getState().gameState.world.time
        )}`,
        type: randomPost.type,
      } as Post,
    });

    return;
  }

  if (chance < 0.05) {
    // gig
  }
}
