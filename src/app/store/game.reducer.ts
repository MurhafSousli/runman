import {Action, ActionReducer} from '@ngrx/store';
import {Tile} from '../tile/tile.model';
import {Player} from "../player/player.model";

export interface GameState {
  grid: Tile[][];
  hero: Player;
}

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
