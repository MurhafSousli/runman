import {Player, Guard, Hero, Tile} from "../models";
import {List} from "../algorithm/list.class";

export interface IGrid {

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

  newGame(x: number, y: number, tileSize: number);
  pauseGame();
  resumeGame();
  moveHero(target: Tile);
  cloneHero();
}
