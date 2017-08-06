import { GameService } from '../service/game.service';
import { Player, Tile } from '../models';
import { PathFinder } from '../algorithm/pathfinder';

export module GridHelper {

  /** Prefix base url for GitHub pages */
  export const prefixUrl = (link) => {
    return 'runman' + link;
  };

  /** Get random number from a range */
  export const getRandomBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  /** Get the available range within the grid */
  export const getRange = (maxIndex: number, currIndex: number, range: number) => {

    const minIndex = 0;
    const min = currIndex - range;
    const max = currIndex + range;
    return {
      min: (min < minIndex) ? minIndex : min,
      max: (max > maxIndex) ? maxIndex : max
    };
  };

  /** Get the tiles of a selected range */
  export const getRangeTiles = (game: GameService, start: Tile, range: number) => {
    const xRange = getRange(game.width - 1, start.index.x, range);
    const yRange = getRange(game.height - 1, start.index.y, range);
    const tiles = [];
    for (let i = xRange.min; i <= xRange.max; i++) {
      for (let j = yRange.min; j <= yRange.max; j++) {
        if (game.grid[i][j].walkable) {
          tiles.push(game.grid[i][j]);
        }
      }
    }
    return tiles;
  };

  /** get random **walkable** target within a range (Auto-pilot) */
  export const getRandomTarget = (game: GameService, player: Player, range: number): Tile => {
    const tiles = getRangeTiles(game, player, range);
    return tiles.filter(tile => tile.walkable)[Math.floor(Math.random() * tiles.length)];
  };

  /** Check if two tiles has the same index */
  export const compareIndex = (src: Tile, target: Tile) => {
    return JSON.stringify(src.index) === JSON.stringify(target.index);
  };

  /** Search for players in a range */
  export const scan = (game: GameService, guard: Player, players: Player[], range?: number) => {

    const xRange = getRange(game.width - 1, guard.index.x, range);
    const yRange = getRange(game.height - 1, guard.index.y, range);

    const routes = [];
    /** Search the range for players */
    for (let i = xRange.min; i <= xRange.max; i++) {
      for (let j = yRange.min; j <= yRange.max; j++) {

        /** Search for players except the guard himself */
        players.filter(player => player !== guard).map((player) => {

          if (compareIndex(game.grid[i][j], player)) {

            /** If player detected */
            const start = game.grid[guard.index.x][guard.index.y];
            const target = game.grid[player.index.x][player.index.y];
            start.walkable = true;
            target.walkable = true;

            const route = PathFinder.searchPath(game, start, target);
            if (route && route.length) {
              routes.push({route: route, target: player});
            }

            start.walkable = false;
            target.walkable = false;
          }
        });
      }
    }
    return routes;
  };

  /** Get number of tiles can fit in view size */
  export const getTileCount = (size, tileSize) => {
    const tileCount = size / tileSize;
    const roundNum = Math.round(tileCount);
    return (tileCount < roundNum) ? roundNum - 1 : roundNum;
  };

  export const setTileBackgroundColor = (tile: Tile, color: string) => {
    tile.styles.backgroundColor = color;
  };

}

