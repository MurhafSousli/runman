import {Action, ActionReducer} from '@ngrx/store';
import {GameState} from "./game.state";

const INITIAL_STATE: GameState = {
  grid: [],
  hero: undefined
};

export const gameReducer: ActionReducer<GameState> = (state: GameState = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    default:
      return action.payload || state;
  }
};
