import {Index} from "../tile/tile.interface";
import {Tile} from "../tile/tile.model";
import {IPlayer, PlayerStates, PlayerActions} from './player.interface';
import {Helper} from "../../service/grid.helper";

export class Player extends Tile implements IPlayer {

  /** Player physical state {idle, walking, dead} */
  state: string;
  /** Player action state*/
  action: string;
  /** Player sprite direction */
  direction: string;
  /** Player's Subject Index */
  subjectIndex: number;
  /** Player Auto-Pilot Index */
  pilotIndex: number;
  /** Player moving speed in ms */
  speed: number;
  /** Player lives */
  lives: boolean[];
  /** Player blood effect */
  blood: boolean;
  /** Player route color */
  color: string;

  constructor(index?: Index, sprite?: string, type?: string) {

    super(index, false);
    this.sprite = Helper.prefixUrl(sprite);
    this.state = PlayerStates.IDLE;
    this.action = PlayerActions.GUARDING;
    this.speed = 300;
    this.lives = [true];
    this.type += " player " + type;
    this.color = 'rgba(249, 208, 82, .8)';
  }
}
