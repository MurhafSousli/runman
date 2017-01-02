import {Index} from "../tile/tile.interface";
import {Tile} from "../tile/tile.model";
import {IPlayer} from './player.interface';
import {Helper} from "../../helpers/helper";
import {PlayerStates, PlayerActions} from "../../store/game.const";

export class Player extends Tile implements IPlayer {

  /** Player physical state {idle, walking, dead} */
  state: string;
  /** Player action state*/
  action: string;
  /** Player sprite direction */
  direction: string;
  /** Player's Routing Index */
  routingIndex: number;
  /** Player Auto-Pilot Index */
  bot: boolean;
  /** Player moving speed in ms */
  speed: number;
  /** Player lives */
  lives: boolean[];
  /** Player blood effect */
  blood: boolean;
  /** Player route color */
  color: string;
  /** Player route */
  route;

  constructor(index?: Index, sprite?: string, type?: string) {

    super(index, false);
    this.sprite = Helper.prefixUrl(sprite);
    this.state = PlayerStates.IDLE;
    this.speed = 300;
    this.lives = [true];
    this.type += " player " + type;
    this.color = 'rgba(249, 208, 82, .8)';
    this.route = [];
    this.bot = true;
  }
}
