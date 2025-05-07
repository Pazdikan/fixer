import { api } from "@/api/api";
import { useState, useRef, useEffect } from "react";
import { useGame } from "./store/game-store";
import { Button } from "@/common/components/ui/button";
import { Pause, Play } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

export function GameClock() {
  const game = useGame();
  const [gameTime, setGameTime] = useState(game.gameState.world.time);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    clearInterval(intervalRef.current as NodeJS.Timeout);

    if (speed > 0) {
      const intervalTime = 1000 / speed;

      intervalRef.current = setInterval(() => {
        if (useGame.getState().gameState.player_id === -1) {
          return;
        }

        setGameTime((prevTime) => {
          const newTime = prevTime + 60000;

          game.updateGameState({
            world: {
              ...game.gameState.world,
              time: newTime,
            },
          });

          return newTime;
        });

        api.event.trigger({
          type: "tick",
        });
      }, intervalTime);
    }

    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [speed]);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  const formatTime = () => {
    const date = new Date();
    date.setTime(gameTime);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hrs = date.getHours();
    const mins = date.getMinutes();

    return `${year}-${month}-${day} ${hrs}:${mins < 10 ? "0" + mins : mins}`;
  };

  const SpeedButton = ({
    speedValue,
    children,
  }: {
    speedValue: number;
    children: React.ReactNode;
  }) => (
    <Button
      variant={speed === speedValue ? "default" : "outline"}
      onClick={() => handleSpeedChange(speedValue)}
      className="relative flex justify-center items-center w-12"
    >
      {children}
    </Button>
  );

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-sm font-bold p-0 h-auto">
            {formatTime()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleSpeedChange(0)}>
            <Pause className="h-4 w-4 mr-2" /> Pause
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSpeedChange(1)}>
            <Play className="h-4 w-4 mr-2" /> Play
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSpeedChange(2)}>
            <div className="flex mr-6 gap-1">
              <Play className="h-4 w-4 absolute left-0 transform translate-x-1/2" />
              <Play className="h-4 w-4 absolute left-2 transform translate-x-1/2" />
            </div>
            2x
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSpeedChange(3)}>
            <div className="flex mr-6 gap-1">
              <Play className="h-4 w-4 absolute left-0 transform translate-x-1/3" />
              <Play className="h-4 w-4 absolute left-2 transform translate-x-1/3" />
              <Play className="h-4 w-4 absolute left-4 transform translate-x-1/3" />
            </div>
            3x
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold">{formatTime()}</span>
      <SpeedButton speedValue={0}>
        <Pause className="h-4 w-4" />
      </SpeedButton>
      <SpeedButton speedValue={1}>
        <Play className="h-4 w-4" />
      </SpeedButton>
      <SpeedButton speedValue={2}>
        <Button
          variant={speed === 2 ? "default" : "outline"}
          onClick={() => handleSpeedChange(2)}
          className="relative flex justify-center items-center w-12"
        >
          <Play className="h-4 w-4 absolute left-0 transform translate-x-1/2" />
          <Play className="h-4 w-4 absolute left-2 transform translate-x-1/2" />
        </Button>
      </SpeedButton>
      <SpeedButton speedValue={3}>
        <Play className="h-4 w-4 absolute left-0 transform translate-x-1/3" />
        <Play className="h-4 w-4 absolute left-2 transform translate-x-1/3" />
        <Play className="h-4 w-4 absolute left-4 transform translate-x-1/3" />
      </SpeedButton>
    </div>
  );
}
