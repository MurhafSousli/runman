import {Index, Search, ITile, TileStyle} from "./tile.interface";
export class Tile implements ITile{

  /** Coordinates on the grid */
  index: Index;
  /** Tile styles */
  styles: TileStyle;
  /** Determine if a tile is a wall */
  walkable: boolean;
  /** A* stuff */
  search: Search;
  /** Test ball for finding path */
  ball: boolean;

  /** sprite src */
  sprite: string;

  constructor(index?: Index, walkable?: boolean) {

    this.search = {
      cost: 0,
      heuristic: 0,
      total: 0
    };
    this.index = index || {x: -1, y: -1};
    this.walkable = walkable || false;
    this.styles = {};
  }

}
