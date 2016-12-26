import {Hero} from "../models/hero/hero.model";
import {Tile} from "../models/tile/tile.model";
import {Guard} from "../models/guard/guard.model";
import {Player} from "../models/player/player.model";

export interface GameState {
  grid: Tile[][];
  hero: Hero;
  guard: Guard;
  score: number;
  time: Date;
  players: Player[];
  state: string;
  message: string;
}
