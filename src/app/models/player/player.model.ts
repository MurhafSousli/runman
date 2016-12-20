import {Index} from "../tile/tile.interface";
import {Tile} from "../tile/tile.model";
import {IPlayer, PlayerState, PlayerActions} from './player.interface';

export class Player extends Tile implements IPlayer {

  /** Player physical state {idle, walking, dead} */
  state: string = PlayerState.IDLE;
  /** Player action state*/
  action: string = PlayerActions.GUARDING;
  /** Player sprite direction */
  direction: string;
  /** Player's Subject Index */
  subjectIndex: number;
  /** Player moving speed in ms */
  speed: number = 300;

  constructor(index?: Index, walkable?: boolean) {

    super(index, walkable);
  }
}
