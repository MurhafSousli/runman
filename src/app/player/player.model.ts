import {Tile, Index} from "../tile/tile.model";

export class Player extends Tile{

  constructor(index: Index, walkable: boolean, tileSize: number, image: string, imagePosition: string) {
    super(index, walkable, tileSize, image, imagePosition);
    this.setBackgroundImage(image, imagePosition);
  }

  setBackgroundImage(src: string, position?: string) {
    this.styles.backgroundImage = "url(" + src + ")" || "";
    this.styles.backgroundPosition = position || "";
    this.styles.backgroundSize = "cover"
  }
}
