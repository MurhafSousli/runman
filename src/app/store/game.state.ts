import {List} from "../helpers/list.class"
import {Hero,Tile ,Guard, Player} from "../models"

export interface GameState {
  grid: Tile[][];
  hero: Hero;
  guard: Guard;
  score: number;
  time: Date;
  players: List<Player>;
  state: string;
}
