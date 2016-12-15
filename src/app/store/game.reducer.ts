import {Action, ActionReducer} from '@ngrx/store';
import {GameState} from "./game.state";

const INITIAL_STATE: GameState = {
  grid: [],
  hero: undefined,
  enemy: undefined
};

export const MOVE_HERO = 'MOVE_HERO';

export const gameReducer: ActionReducer<GameState> = (state: GameState = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case MOVE_HERO:
      break;

    default:
      return action.payload || state;
  }
};
