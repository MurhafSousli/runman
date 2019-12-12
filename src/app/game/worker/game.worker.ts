/// <reference lib="webworker" />

import { GameWebWorker, UserAction } from '../models';
import { GameEngine } from './game.engine';

const engine = new GameEngine();

engine.state.subscribe((state) => postMessage(state));

addEventListener('message', ({ data }: GameWebWorker) => {
  console.log('Worker action', data);
  switch (data.action) {
    case UserAction.HERO_MOVE:
      engine.moveHero(data.payload.target);
      break;
    case UserAction.HERO_CLONE:
      engine.cloneHero();
      break;
    case UserAction.GAME_NEW:
      engine.create({
        data: data.payload.data,
        rows: data.payload.rows,
        cols: data.payload.cols,
        debug: data.payload.debug,
        debugDelay: data.payload.debugDelay
      });
      break;
    case UserAction.GAME_PAUSE:
      engine.resume();
      break;
    case UserAction.GAME_RESUME:
      engine.pause();
      break;
  }
});
