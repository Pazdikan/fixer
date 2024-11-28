# ToDo

## General

- Import network from preact version
- Create an event system
- Remake keybinds into api with console (shadcn component) commands and keybinds
- Remake company generator into api (create company, etc.)
- Fix "api.generator.\*" causing 'api.generator' is possibly 'null' error
- Implement dexie.js as an alternative to local storage

## "Known Things"

- Implement a "known things" list.

This will be tricky. It will be used to store all things that player has seen, and will be used to display item information in the game. This will be used for everything.

For example when player learns about a company name, it will be stored in the object, and will be used to display building information in the game. This will be used for everything.

Example structure:

```json
{
  "companies": {
    "company_id": ["name", "owner", "employees"]
  },
  "characters": {
    "character_id": ["name", "company"]
  }
}
```

This will be similar to the game shadows of doubt.

## Map

- Add map on new game page, selecting gameplay area and starting base location
- Add map teleportation to a city name from input, so players can find an area faster
- Add spinner for when it's loading map buildings (data is couple of MB)
- Fetched building data should be stored in local storage to avoid redownloading it on every page refresh
- Add starting base and companies to map

Notes: Map components gets rendered with selectable plugin, which is used to select gameplay area. After selecting the area, building data is fetched in the background, and saved to local storage. Map is then re-rendered and bounded with selected area, and also all fetched buildings. Player can now select starting base location. Keep map bounds, and buildings as a gameState object. An object (for example company) will store the location (building) id, meaning adding markers to the map will be straightforward.
