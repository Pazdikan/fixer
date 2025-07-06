import { api } from "@/api/api";
import { useState, useRef, useEffect, useCallback } from "react";
import { useGame } from "./store/game-store";
import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";

const SpeedButton = React.memo(
  ({
    speedValue,
    currentSpeed,
    onChange,
    children,
  }: {
    speedValue: number;
    currentSpeed: number;
    onChange: (v: number) => void;
    children: React.ReactNode;
  }) => (
    <Button
      variant={currentSpeed === speedValue ? "default" : "outline"}
      onClick={() => onChange(speedValue)}
      className="relative flex justify-center items-center w-12 p-2"
    >
      {children}
    </Button>
  )
);

export function GameClock() {
  const game = useGame();
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  // Always read time from global state
  const gameTime = game.gameState.world.time;

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (speed > 0) {
      const intervalTime = 1000 / speed;

      intervalRef.current = setInterval(() => {
        if (useGame.getState().gameState.player_id === -1) {
          return;
        }

        const prevTime = useGame.getState().gameState.world.time;
        const newTime = prevTime + 60000;

        game.updateGameState({
          world: {
            ...game.gameState.world,
            time: newTime,
          },
        });

        api.event.trigger({
          type: "tick",
        });
      }, intervalTime);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [speed, game]);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-sm font-bold p-0 h-auto">
            {api.util.formatTime(gameTime)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleSpeedChange(0)}>
            <img src="@/../assets/icons/pause.svg" className="w-6 h-4" /> Pause
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSpeedChange(1)}>
            <img src="@/../assets/icons/play.svg" className="w-6 h-4" /> Play
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSpeedChange(2)}>
            <div className="flex gap-1">
              <img
                src="@/../assets/icons/fast-forward.svg"
                className="w-6 h-4"
              />
            </div>
            2x
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSpeedChange(3)}>
            <div className="flex gap-1">
              <img
                src="@/../assets/icons/fast-forward-3x.svg"
                className="w-6 h-4"
              />
            </div>
            3x
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold">{api.util.formatTime(gameTime)}</span>
      <SpeedButton
        speedValue={0}
        currentSpeed={speed}
        onChange={handleSpeedChange}
      >
        <img src="@/../assets/icons/pause.svg" className="h-5 w-5" />
      </SpeedButton>
      <SpeedButton
        speedValue={1}
        currentSpeed={speed}
        onChange={handleSpeedChange}
      >
        <img src="@/../assets/icons/play.svg" className="h-6 w-6" />
      </SpeedButton>
      <SpeedButton
        speedValue={2}
        currentSpeed={speed}
        onChange={handleSpeedChange}
      >
        <img src="@/../assets/icons/fast-forward.svg" className="h-6 w-6" />
      </SpeedButton>
      <SpeedButton
        speedValue={3}
        currentSpeed={speed}
        onChange={handleSpeedChange}
      >
        <img
          src="@/../assets/icons/fast-forward-3x.svg"
          className="w-12 h-12"
        />
      </SpeedButton>
    </div>
  );
}
