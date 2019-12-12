import { Tile, TileNode } from '../classes';

export class List<T> extends Array<T> {

  remove(item: T) {
    const index = this.indexOf(item);
    if (index !== -1) {
      return this.splice(index, 1);
    }
  }

  contains(item: T): boolean {
    // return this.some(e => e === item);
    return this.indexOf(item) !== -1;
  }
}

export interface Index {
  x: number;
  y: number;
}

export interface Search {
  g?: number;
  h?: number;
  f?: number;
  inOpenList?: boolean;
  inClosedList?: boolean;
  inPathList?: boolean;
}

export interface TileStyle {
  width?: string;
  height?: string;
  left?: string;
  top?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  transform?: string;
}

export interface MovingState {
  target?: Index;
  player?: PlayerState;
}

export interface GameState {
  constants?: {
    tileSize: number;
    scanInterval: number;
  };
  grid?: TileState[][];
  goal?: Index;
  score?: number;
  timeLeft?: string;
  players?: {
    [key: string]: PlayerState
  };
  status?: string;
  debug?: {
    openList?: TileNode[];
    closedList?: TileNode[];
    shortestPath?: TileNode[];
  };
}

export interface TileState {
  index?: Index;
  walkable?: boolean;
  sprite?: string;
  className?: string;
  search?: Search;
}

export interface PlayerState extends TileState {
  status?: string;
  action?: string;
  direction?: string;
  routingIndex?: number;
  bot?: boolean;
  speed?: number;
  lives?: boolean[];
  blood?: boolean;
  color?: string;
  styles?: any;
}

