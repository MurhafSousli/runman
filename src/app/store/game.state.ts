import {Hero} from "../models/hero/hero.model";
import {Tile} from "../models/tile/tile.model";
import {Guard} from "../models/guard/guard.model";
import {Player} from "../models/player/player.model";
import {List} from "../algorithm/list.class";

export interface GameState {
  grid: Tile[][];
  hero: Hero;
  guard: Guard;
  score: number;
  time: Date;
  players: List<Player>;
  state: string;
}
