import {Enemy} from "../models/enemy/enemy.model";
import {Hero} from "../models/hero/hero.model";
import {Tile} from "../models/tile/tile.model";

export interface IGrid {

  grid: Tile[][];
  height: number;
  width: number;
  tileSize: number;
  hero: Hero;
  enemy: Enemy;

  newGame(x: number, y: number, tileSize: number);
  loadMap(x: number, y: number);
  moveHero(target: Tile);
  setState();
}
