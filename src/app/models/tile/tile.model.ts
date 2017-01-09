import {Index, Search, ITile, TileStyle} from "./tile.interface";
import {GridHelper} from "../../helpers";

export class Tile implements ITile{

  /** Coordinates on the grid */
  index: Index;
  /** Tile styles */
  styles: TileStyle;
  /** Determine if a tile is a wall */
  walkable: boolean;
  /** A* stuff */
  search: Search;
  /** sprite src */
  sprite: string;
  /** Tile type */
  type: string;

  constructor(index?: Index, walkable?: boolean, sprite?:string) {

    this.search = {
      cost: 0,
      heuristic: 0,
      total: 0
    };
    this.index = index || {x: -1, y: -1};
    this.walkable = walkable || false;
    this.sprite = sprite ? GridHelper.prefixUrl(sprite) : undefined;
    this.styles = {};
    this.type = 'tile';
  }

}
