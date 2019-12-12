import { Index, Search } from '../models';
import { MapObject } from './object';

export interface TileState {
  index?: Index;
  sprite?: string;
  walkable?: boolean;
  className?: string;
  search?: Search;
}

export interface TileNode {
  index?: Index;
  search?: Search;
  walkable?: boolean;
}

export class Tile extends MapObject implements TileNode {
  // Is tile walkable
  walkable: boolean;
  // Path finder variables
  search: Search = {
    g: 0,
    h: 0,
    f: 0
  };

  /**
   * Tile value in game state
   */
  get state(): TileState {
    return {
      index: this.index,
      walkable: this.walkable,
      sprite: this.sprite,
      className: this.className,
      search: this.search
    };
  }

  /**
   * Tile value in path finder
   */
  get node(): TileNode {
    return {
      search: this.search,
      index: this.index,
      walkable: this.walkable
    };
  }

  constructor(params: TileState) {
    super(params);
    this.walkable = params.walkable;
  }
}
