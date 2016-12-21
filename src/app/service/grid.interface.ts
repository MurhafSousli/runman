import {Subject} from "rxjs/Subject";
import {Guard} from "../models/guard/guard.model";
import {Hero} from "../models/hero/hero.model";
import {Tile} from "../models/tile/tile.model";

export interface IGrid {

  grid: Tile[][];
  height: number;
  width: number;
  tileSize: number;
  hero: Hero;
  guard: Guard;

  // players$: Subject<Tile[]>[];
  // move$: Subject<any>;
  // action$: Subject<any>;

  newGame(x: number, y: number, tileSize: number);

  moveHero(target: Tile);
  setState();
}
