import {ITile} from "../tile/tile.interface";

export interface IPlayer extends ITile {

  /** Player physical state {idle, walking, dead} */
  state: string;
  /** Player action state*/
  action: string;
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

export const PlayerDirections = {
  TOP: "walkingTop",
  LEFT: "walkingLeft",
  RIGHT: "walkingRight",
  BOTTOM: "walkingBottom"
};

export const PlayerActions = {
  ATTACKING: "ATTACKING",
  GUARDING: "GUARDING"
};
