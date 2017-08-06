import { Action } from '@ngrx/store';
import { GameMode, GameStore } from './game.const';
import { GameState } from './game.state';

const INITIAL_STATE: GameState = {
  grid: undefined,
  hero: undefined,
  guard: undefined,
  players: undefined,
  time: undefined,
  score: 0,
  state: GameMode.PLAYING
};

export function gameReducer(state: GameState = INITIAL_STATE, action: Action): GameState {
  switch (action.type) {

    case GameStore.GAME_STATE:
      return Object.assign({}, state, {state: action.payload});

    case GameStore.TIMER_TICK:
      return Object.assign({}, state, {time: action.payload});

    case GameStore.UPDATE_STORE:
      return Object.assign({}, state, action.payload);

    default:
      return Object.assign({}, state, action.payload);
  }
}
