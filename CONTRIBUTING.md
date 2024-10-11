# What can I contribute?

The best way to help right now (in very early development) is to play the game and either report new issues or provide additional information on [existing issues](https://github.com/Pazdikan/fixer/issues). I'm not looking for coding help at the moment, unless I've created an issue with the [help wanted](https://github.com/pazdikan/fixer/labels/help%20wanted) tag.

# Commit name conventions

> [!WARNING]  
> Please follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) guidelines! This helps with generating a changelog and keeping the codebase organized.  
> Example: `feat: Add Polish translation`

# Best code practices

## useGameState()

```typescript
const { gameState, updateGameState } = useGameState();
```

This hook is a custom hook that provides access to the global game state (save file).

#### `gameState`

- gameState MUST only be used in user interface (UI) components
- You MUST NOT use the gameState object directly in game logic. Check the examples below.

#### `updateGameState(prevState => {})`

- The callback property `prevState` can also be used in game logic to access the most up to date game state.

#### Updating the game state

```typescript
updateGameState((prevState) => {
  const newCharacters = [...prevState.characters, newCharacter];

  return {
    characters: newCharacters,
  };
});
```

```typescript
function generateCompany(gameState: GameState) {...}

// This is a "game logic" function. It must be up to date with the game state.
// This is why you MUST use the prevState argument from updateGameState.

generateCompany(
    updateGameState((prevState) => prevState)
);
```
