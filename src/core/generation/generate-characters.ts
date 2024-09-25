import { Character, GameState } from "@/types/game-state";

export const create_character = (object: Character, updateGameState: (updates: ((prevState: GameState) => Partial<GameState>)) => void) => {
    if (!object.first_name || !object.last_name || !object.backstory || !object.previous_job) {
      console.error("All fields are required");
      return;
    }
  
    updateGameState(prevState => {
      const updatedCharacters = [...prevState.characters, object];
      return {
        characters: updatedCharacters,
        player_id: prevState.player_id === -1 ? updatedCharacters.length - 1 : prevState.player_id
      };
    });
  };  