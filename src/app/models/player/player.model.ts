import {Index} from "../tile/tile.interface";
import {Tile} from "../tile/tile.model";
import {IPlayer, PlayerStates, PlayerActions} from './player.interface';

export class Player extends Tile implements IPlayer {

  /** Player physical state {idle, walking, dead} */
  state: string;
  /** Player action state*/
  action: string;
  /** Player sprite direction */
  direction: string;
  /** Player's Subject Index */
  subjectIndex: number;
  /** Player moving speed in ms */
  speed: number;
  /** Player lives */
  lives: boolean[];
  /** Player blood effect */
  blood: boolean;

  pilotIndex: number;

  constructor(index?: Index, walkable?: boolean) {

    super(index, walkable);

    this.state = PlayerStates.IDLE;
    this.action = PlayerActions.GUARDING;
    this.speed = 300;
    this.lives = [true];
    this.type += " player";
  }
}
