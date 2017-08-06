import { List } from '../helpers/list.class';
import { Guard, Hero, Player, Tile } from '../models';

export interface GameState {
  grid: Tile[][];
  hero: Hero;
  guard: Guard;
  score: number;
  time: Date;
  players: List<Player>;
  state: string;
}
