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
  /** Player route */
  route;
}

export const PlayerStates = {
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

export interface PlayerRoute {
  player: IPlayer,
  target: ITile
}

export const PlayerSprites = {
  GRIM_REAPER: "../../assets/img/guard.png",
  HERO: "../../assets/img/hero.png",
  BOY: "../../assets/img/boy.png",
  BLOOD: "../../assets/img/blood.png",
  GRIM_REAPER_AVATAR: '../../assets/img/reaper.png',
  FLAG: "../../assets/img/flag.png"
};
