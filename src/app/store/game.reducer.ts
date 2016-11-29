import {Action, ActionReducer} from '@ngrx/store';
import {GameState} from "./game.state";


export const gameReducer: ActionReducer<GameState> = (state: GameState, action: Action) => {
  switch (action.type) {
    default:
      return action.payload || state;
  }
};
