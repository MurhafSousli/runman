import { Index } from '../models';

interface MapObjectState {
  index?: Index;
  sprite?: string;
  walkable?: boolean;
  className?: string;
  size?: number;
}

export class MapObject {
  // Coordinates on the grid
  index: Index;
  // Sprite src
  sprite: string;
  // Tile class name
  className: string;
  // Tile size
  size: number;

  get state(): MapObjectState {
    return {
      index: this.index,
      sprite: this.sprite,
      className: this.className,
      size: this.size
    };
  }

  constructor({ index, sprite, className, size }: MapObjectState) {
    this.index = index || { x: -1, y: -1 };
    this.sprite = sprite;
    this.className = className ? `tile ${className}` : 'tile';
    this.size = size;
  }
}
