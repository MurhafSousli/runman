import {Action, ActionReducer} from '@ngrx/store';
import {GameState} from "./game.state";

const INITIAL_STATE: GameState = {
  grid: [],
  hero: undefined,
  guard: undefined,
  players: undefined,
  time: undefined,
  score: 0,
  state: undefined
};

export const GameStore = {
  NEW_GAME: 'NEW_GAME',
  GAME_OVER: 'GAME_OVER',
  TIMER_TICK: 'TIMER_TICK'
};

export const GameModal = {
  TIME_UP: "TIME'S UP",
  PAUSED: "PAUSED",
  WON: "WON",
  LOST: "LOST"
};
export const gameReducer: ActionReducer<GameState> = (state: GameState = INITIAL_STATE, action: Action) => {
  switch (action.type) {

    case GameStore.GAME_OVER:
      return Object.assign({}, state, {state: action.payload});

    case GameStore.TIMER_TICK:
      return Object.assign({}, state, {time: action.payload});

    default:
      return Object.assign({}, state, action.payload);

  }
};
