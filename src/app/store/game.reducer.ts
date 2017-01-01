import {Action, ActionReducer} from '@ngrx/store';
import {GameState} from "./game.state";

export const GameStore = {
  NEW_GAME: 'NEW_GAME',
  GAME_STATE: 'GAME_STATE',
  TIMER_TICK: 'TIMER_TICK'
};

export const GameMode = {
  TIME_UP: "TIME'S UP",
  PAUSED: "PAUSED",
  WON: "WON",
  LOST: "LOST",
  PLAYING: "PLAYING"
};

export const GameSettings = {
  TIME: 3 * 60,
  SCAN_INTERVAL: 800,
};

const INITIAL_STATE: GameState = {
  grid: [],
  hero: undefined,
  guard: undefined,
  players: undefined,
  time: undefined,
  score: 0,
  state: GameMode.PLAYING
};

export const gameReducer: ActionReducer<GameState> = (state: GameState = INITIAL_STATE, action: Action) => {
  switch (action.type) {

    case GameStore.GAME_STATE:
      return Object.assign({}, state, {state: action.payload});

    case GameStore.TIMER_TICK:
      return Object.assign({}, state, {time: action.payload});

    default:
      return Object.assign({}, state, action.payload);

  }
};
