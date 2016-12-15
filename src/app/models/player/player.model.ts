import {GridService} from "../../services/grid.service";
import {Index} from "../tile/tile.interface";
import {Tile} from "../tile/tile.model";
import {IPlayer, PlayerState} from './player.interface';

export class Player extends Tile implements IPlayer {

  /** Player state {idle, walking, dead} */
  state: string = PlayerState.IDLE;
  /** Player sprite src */
  sprite: string;
  /** Player sprite direction */
  direction: string;
  /** Player's Subject Index */
  subjectIndex: number;

  constructor(index?: Index, walkable?: boolean) {

    super(index, walkable);
  }
}
