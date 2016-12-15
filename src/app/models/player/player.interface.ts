import {ITile} from "../tile/tile.interface";

export interface IPlayer extends ITile {

  /** Player state */
  state: string;
  /** sprite src */
  sprite: string;
  /** Player sprite direction */
  direction: string;
  /** Player's Subject Index */
  subjectIndex: number;
}

export const PlayerState = {
  IDLE: "IDLE",
  WALKING: "WALKING",
  DEAD: "DEAD"
};
