/**
 * Game web worker actions
 */
export const UserAction = {
  GAME_NEW: 'GAME_NEW',
  GAME_PAUSE: 'GAME_PAUSE',
  GAME_RESUME: 'GAME_RESUME',
  HERO_MOVE: 'HERO_MOVE',
  HERO_CLONE: 'HERO_CLONE'
};

export interface GameWebWorker {
  data: {
    action: string;
    payload?: any
  };
}

export const GameStore = {
  UPDATE_STORE: 'UPDATE_STORE',
  GAME_STATE: 'GAME_STATE',
  TIMER_TICK: 'TIMER_TICK'
};

export const GameMode = {
  TIME_UP: 'TIME\'S UP',
  PAUSED: 'PAUSED',
  WON: 'WON',
  LOST: 'LOST',
  PLAYING: 'PLAYING',
  ABOUT: 'ABOUT'
};

export const PlayerStates = {
  IDLE: 'IDLE',
  WALKING: 'WALKING',
  DEAD: 'DEAD'
};

export const PlayerDirections = {
  TOP: 'walkingTop',
  LEFT: 'walkingLeft',
  RIGHT: 'walkingRight',
  BOTTOM: 'walkingBottom'
};

export const PlayerActions = {
  ATTACKING: 'ATTACKING',
  GUARDING: 'GUARDING'
};

export const PlayerSprites = {
  GRIM_REAPER: 'assets/img/guard.png',
  HERO: 'assets/img/hero.png',
  BOY: 'assets/img/boy.png',
  BLOOD: 'assets/img/blood.png',
  GRIM_REAPER_AVATAR: 'assets/img/reaper.png',
  FLAG: 'assets/img/flag.png'
};

export const AudioFiles = {
  REMOVE: 'assets/sounds/remove.ogg',
  WIN: 'assets/sounds/win.ogg',
  ATTACK: 'assets/sounds/attack.ogg',
  GAME_OVER: 'assets/sounds/game-over.ogg',
  PAUSE: 'assets/sounds/pause.ogg',
  MUSIC: 'assets/sounds/music.mp3'
};
