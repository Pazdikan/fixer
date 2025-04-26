import { api } from "@/api/api";
import { useState, useRef, useEffect } from "react";
import { useGame } from "./store/game-store";
import { Button } from "@/common/components/ui/button";
import { Pause, Play } from "lucide-react";

export function GameClock() {
  const [gameTime, setGameTime] = useState(Date.now());
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    clearInterval(intervalRef.current as NodeJS.Timeout);

    if (speed > 0) {
      const intervalTime = 1000 / speed;

      intervalRef.current = setInterval(() => {
        if (useGame.getState().gameState.player_id === -1) {
          return;
        }

        setGameTime((prevTime) => prevTime + 60000);

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

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold">{formatTime()}</span>

      <Button
        variant={speed === 0 ? "default" : "outline"}
        onClick={() => handleSpeedChange(0)}
        className="w-12"
      >
        <Pause className="h-4 w-4" />
      </Button>
      <Button
        variant={speed === 1 ? "default" : "outline"}
        onClick={() => handleSpeedChange(1)}
        className="w-12"
      >
        <Play className="h-4 w-4" />
      </Button>
      <Button
        variant={speed === 2 ? "default" : "outline"}
        onClick={() => handleSpeedChange(2)}
        className="relative flex justify-center items-center w-12"
      >
        <Play className="h-4 w-4 absolute left-0 transform translate-x-1/2" />
        <Play className="h-4 w-4 absolute left-2 transform translate-x-1/2" />
      </Button>
      <Button
        variant={speed === 3 ? "default" : "outline"}
        onClick={() => handleSpeedChange(3)}
        className="relative flex justify-center items-center w-12"
      >
        <Play className="h-4 w-4 absolute left-0 transform translate-x-1/3" />
        <Play className="h-4 w-4 absolute left-2 transform translate-x-1/3" />
        <Play className="h-4 w-4 absolute left-4 transform translate-x-1/3" />
      </Button>
    </div>
  );
}
