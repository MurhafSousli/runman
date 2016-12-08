import {Player} from "../player/player.model";
import {Tile} from "../tile/tile.model";

export interface GameState {
  grid: Tile[][];
  hero: Player;
}
