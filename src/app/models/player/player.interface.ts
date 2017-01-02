import {ITile} from "../tile/tile.interface";

export interface IPlayer extends ITile {

  /** Player physical state {idle, walking, dead} */
  state: string;
  /** Player action state*/
  action: string;
  /** Player sprite direction */
  direction: string;
  /** Player's Subject Index */
  routingIndex: number;
  /** Is Player bot */
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
}
