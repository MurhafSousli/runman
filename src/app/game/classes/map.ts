import { Tile } from './tile';
import { Index, PlayerState } from '../models';
import { Player } from './player';
import { compareIndex } from '../../map/map';

interface MapParams {
  data?: any;
  rows?: number;
  cols?: number;
}

interface Range {
  min?: number;
  max?: number;
}

export class GameMap {

  readonly grid: Tile[][];
  readonly rows: number;
  readonly cols: number;

  constructor(params: MapParams) {
    this.grid = createGridFromData(params);
  }

  /**
   * Get tile by index.ts
   */
  getTile(index: Index): Tile | null {
    if (this.grid[index.x] && this.grid[index.x][index.y]) {
      return this.grid[index.x][index.y];
    }
  }

  /**
   * Get the tiles of a given range
   */
  getRangeTiles(start: Index, range: number): Tile[] {
    const xRange = getRange(this.rows - 1, start.x, range);
    const yRange = getRange(this.cols - 1, start.y, range);
    const tiles = [];
    for (let i = xRange.min; i <= xRange.max; i++) {
      for (let j = yRange.min; j <= yRange.max; j++) {
        const tile = this.getTile({ x: i, y: j });
        if (tile.state.walkable) {
          tiles.push(tile);
        }
      }
    }
    return tiles;
  }

  /**
   * Get a random walkable tile within a range (Auto-pilot)
   */
  getRandomTarget(player: PlayerState, range: number): Tile {
    const tiles = this.getRangeTiles(player.index, range);
    return tiles.filter((tile: Tile) => tile.walkable)[Math.floor(Math.random() * tiles.length)];
  }


  /**
   * Search for players in a range
   */
  scan(guard: Player, players: Player[], range?: number) {

    const xRange = getRange(this.rows - 1, guard.index.x, range);
    const yRange = getRange(this.cols - 1, guard.index.y, range);

    const routes = [];
    // Search for players in range
    for (let x = xRange.min; x <= xRange.max; x++) {
      for (let y = yRange.min; y <= yRange.max; y++) {
        // Filter guard
        players.filter((player: Player) => player !== guard).map((player: Player) => {

          if (compareIndex({ x, y }, player.index)) {

            /** If player detected */
            const start = this.getTile(guard.index);
            const target = this.getTile(player.index);
            start.walkable = true;
            target.walkable = true;

            const route = []; // searchPath(start, target);
            if (route && route.length) {
              routes.push({ route, target: player });
            }

            start.walkable = false;
            target.walkable = false;
          }
        });
      }
    }
    return routes;
  }
}

function createGridFromData({ data, rows, cols }: MapParams): Tile[][] {

  const grid: Tile[][] = [];

  // Generate the grid
  for (let x = 0; x < rows; x++) {
    grid[x] = [];
    for (let y = 0; y < cols; y++) {
      // grid[x][y] = new Tile({
      //   index: { x, y },
      //   walkable: true
      // });
      grid[x].push(new Tile({
        index: { x, y },
        walkable: true
      }));
    }
  }

  // Load map objects on the grid
  data.map((t: Tile) => {
    // Check if data tile is within map range
    if (t.index.x < rows && t.index.y < cols) {
      grid[t.index.x][t.index.y] = new Tile({
        index: t.index,
        className: t.className,
        walkable: t.walkable,
        sprite: t.sprite
      });
    }
  });

  return grid;
}

export function getRange(maxIndex: number, currIndex: number, range: number): Range {
  const minIndex = 0;
  const min = currIndex - range;
  const max = currIndex + range;
  return {
    min: (min < minIndex) ? minIndex : min,
    max: (max > maxIndex) ? maxIndex : max
  };
}

