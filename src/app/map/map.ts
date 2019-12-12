// // import { searchPath } from '../game/worker/path-finding';
// import { Index, Player, Tile, GameMap } from '../game/classes';

import { Index } from '../game/models';

/** Get random number from a range */
export function getRandomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

/** Get the available range within the grid */
// export function getRange(maxIndex: number, currIndex: number, range: number) {
//   const minIndex = 0;
//   const min = currIndex - range;
//   const max = currIndex + range;
//   return {
//     min: (min < minIndex) ? minIndex : min,
//     max: (max > maxIndex) ? maxIndex : max
//   };
// }

/** Get the tiles of a selected range */
// export function getRangeTiles(gameMap: GameMap, rows: number, cols: number, start: Tile, range: number) {
//   const xRange = getRange(rows - 1, start.state.index.ts.x, range);
//   const yRange = getRange(cols - 1, start.state.index.ts.y, range);
//   const tiles = [];
//   for (let i = xRange.min; i <= xRange.max; i++) {
//     for (let j = yRange.min; j <= yRange.max; j++) {
//       const tile = gameMap.getTile({ x: i, y: j });
//       if (tile.state.walkable) {
//         tiles.push(tile);
//       }
//     }
//   }
//   return tiles;
// }

/** get random **walkable** target within a range (Auto-pilot) */
// export function getRandomTarget(grid: Tile[][], width: number, height: number, player: Player, range: number): Tile {
//   const tiles = getRangeTiles(grid, width, height, player, range);
//   return tiles.filter(tile => tile.walkable)[Math.floor(Math.random() * tiles.length)];
// }
//
// /** Search for players in a range */
// export function scan(guard: Player, players: Player[], range?: number) {
//
//   const xRange = getRange(width - 1, guard.index.ts.x, range);
//   const yRange = getRange(height - 1, guard.index.ts.y, range);
//
//   const routes = [];
//   /** Search the range for players */
//   for (let i = xRange.min; i <= xRange.max; i++) {
//     for (let j = yRange.min; j <= yRange.max; j++) {
//       /** Search for players except the guard himself */
//       players.filter(player => player !== guard).map((player) => {
//
//         if (compareIndex(grid[i][j].index.ts, player.index.ts)) {
//
//           /** If player detected */
//           const start = grid[guard.index.ts.x][guard.index.ts.y];
//           const target = grid[player.index.ts.x][player.index.ts.y];
//           start.walkable = true;
//           target.walkable = true;
//
//           const route = searchPath(grid, start, target, width, height);
//           if (route && route.length) {
//             routes.push({ route, target: player });
//           }
//
//           start.walkable = false;
//           target.walkable = false;
//         }
//       });
//     }
//   }
//   return routes;
// }

/** Get number of tiles can fit in view size */
export function getTileCount(size, tileSize) {
  const tileCount = size / tileSize;
  const roundNum = Math.round(tileCount);
  return (tileCount < roundNum) ? roundNum - 1 : roundNum;
}

/** Check if two tiles has the same index.ts */
export function compareIndex(src: Index, target: Index) {
  return JSON.stringify(src) === JSON.stringify(target);
}

