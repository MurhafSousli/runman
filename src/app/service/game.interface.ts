import {Player, Guard, Hero, Tile} from "../models";
import {List} from "../helpers/list.class";

export interface IGame {

  grid: Tile[][];
  height: number;
  width: number;
  tileSize: number;
  hero: Hero;
  guard: Guard;
  goal: Tile;
  players: List<Player>;
  /** Game score */
  score: number;
  time: number;

  newGame(x: number, y: number);
  pauseGame();
  resumeGame();
  moveHero(target: Tile);
  addBot();
}
