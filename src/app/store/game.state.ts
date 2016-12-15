import {Hero} from "../models/hero/hero.model";
import {Tile} from "../models/tile/tile.model";
import {Enemy} from "../models/enemy/enemy.model";

export interface GameState {
  grid: Tile[][];
  hero: Hero;
  enemy: Enemy;
}
