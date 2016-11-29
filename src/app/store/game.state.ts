import {Node} from '../models/node.model';
import {Player} from "../models/player.model";

export interface GameState {
  matrix: Node[][];
  hero: Player;
}
