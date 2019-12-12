import { Index } from '../models';
import { Tile, TileNode } from '../classes';

export class Grid {
  readonly grid: TileNode[][];
  readonly acceptableTiles: TileNode[][];
  readonly rows: number;
  readonly cols: number;

  constructor(grid: Tile[][]) {
    this.grid = grid.map(row => row.map(col => col.node));
    this.rows = this.grid.length;
    this.cols = this.grid.length ? this.grid[0].length : 0;
    this.acceptableTiles = this.grid.map((row => row.filter(tile => tile.walkable)));
  }

  /**
   * Get tile by index
   */
  getTile(index: Index): TileNode | null {
    if (this.grid[index.x] && this.grid[index.x][index.y]) {
      return this.grid[index.x][index.y];
    }
  }

}
