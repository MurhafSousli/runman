import {TileStyle} from "./tile-style.model";
export class Tile {
  /** Coordinates on the grid */
  index: Index;
  /** Node backgroundImage */
  styles: TileStyle = new TileStyle();
  /** Determine if a tile is a wall */
  walkable: boolean;
  /** Tile size */
  tileSize: number;

  /** A* stuff */
  cost: number = 0;
  heuristic: number = 0;
  total: number = 0;

  /** Test ball for finding path */
  ball: boolean;

  constructor(index?: Index, walkable?: boolean, tileSize?: number, image?: string, imagePosition?: string) {
    this.index = index || { x: -1, y: -1};
    this.walkable = walkable;
    this.setTileSize(tileSize || 50);
    this.setBackgroundImage(image || "", imagePosition || "contain");
  }

  getStyles() {
    this.setPosition();
    return this.styles;
  }

  setPosition() {
    this.styles.left = this.index.x * this.tileSize + "px";
    this.styles.top = this.index.y * this.tileSize + "px";
  }

  setBackgroundColor(color: string) {
    this.styles.backgroundColor = color;
  }

  setBackgroundImage(src: string, position?: string) {
    this.styles.backgroundImage = "url(" + src + ")" || "";
    this.styles.backgroundPosition = position || "";
  }

  setTileSize(tileSize: number) {
    this.tileSize = tileSize;
    this.styles.width = tileSize + "px";
    this.styles.height = tileSize + "px";
  }

  printIndex() {
    console.log(this.index);
  }
}

export interface Index {
  x: number;
  y: number;
}
