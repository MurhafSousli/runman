import {GameService} from "../service/game.service";
import {Player, Tile} from "../models";
import {PathFinder} from "../algorithm/pathfinder";
import {PlayerDirections} from "../store/game.const";

export module GridHelper {

  /** Prefix base url for GitHub pages */
  export const prefixUrl = (link) => {
    return "runman" + link;
  };

  /** Get random number from a range */
  export const getRandomBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  /** Get the available range within the grid */
  export const getRange = (maxIndex: number, currIndex: number, range: number) => {

    let minIndex = 0;
    let min = currIndex - range;
    let max = currIndex + range;
    return {
      min: (min < minIndex) ? minIndex : min,
      max: (max > maxIndex) ? maxIndex : max
    };
  };

  /** Get the tiles of a selected range */
  export const getRangeTiles = (game: GameService, start: Tile, range: number) => {
    let xRange = getRange(game.width - 1, start.index.x, range);
    let yRange = getRange(game.height - 1, start.index.y, range);
    let tiles = [];
    for (let i = xRange.min; i <= xRange.max; i++)
      for (let j = yRange.min; j <= yRange.max; j++)
        if (game.grid[i][j].walkable)
          tiles.push(game.grid[i][j]);
    return tiles;
  };

  /** get random **walkable** target within a range (Auto-pilot) */
  export const getRandomTarget = (game: GameService, player: Player, range: number): Tile => {
    let tiles = getRangeTiles(game, player, range);
    return tiles.filter(tile => tile.walkable)[Math.floor(Math.random() * tiles.length)];
  };

  /** Search for players in a range */
  export const scan = (game: GameService, guard: Player, players: Player[], range?: number) => {

    let xRange = getRange(game.width - 1, guard.index.x, range);
    let yRange = getRange(game.height - 1, guard.index.y, range);

    let routes = [];
    /** Search the range for players */
    for (let i = xRange.min; i <= xRange.max; i++)
      for (let j = yRange.min; j <= yRange.max; j++)

        /** Search for players except the guard himself */
        players.filter(player => player !== guard).map((player) => {

          if (compareIndex(game.grid[i][j], player)) {

            /** If player detected */
            let start = game.grid[guard.index.x][guard.index.y];
            let target = game.grid[player.index.x][player.index.y];
            start.walkable = true;
            target.walkable = true;

            let route = PathFinder.searchPath(game, start, target);
            if (route && route.length) routes.push({route: route, target: player});

            start.walkable = false;
            target.walkable = false;
          }
        });
    return routes
  };

  /** Get number of tiles can fit in view size */
  export const getTileCount = (size, tileSize) => {
    let tileCount = size / tileSize;
    let roundNum = Math.round(tileCount);
    return (tileCount < roundNum) ? roundNum - 1 : roundNum;
  };

  /** Check if two tiles has the same index */
  export const compareIndex = (src: Tile, target: Tile) => {
    return JSON.stringify(src.index) === JSON.stringify(target.index);
  };

  export const setTileBackgroundColor = (tile: Tile, color: string) => {
    tile.styles.backgroundColor = color;
  };

}

