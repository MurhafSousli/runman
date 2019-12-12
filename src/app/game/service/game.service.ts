import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { GameState, Index, PlayerState, TileState, UserAction } from '../models';
import mapData from './map.json';
import { TileNode } from '../classes';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly _worker: any;
  private readonly _state = new BehaviorSubject<GameState>({});

  readonly state = this._state.asObservable();
  readonly size: Observable<{ width: number, height: number }>;
  readonly players: Observable<{ [key: string]: PlayerState }>;
  readonly grid: Observable<TileState[][]>;
  readonly constants: Observable<{ tileSize: number }>;
  readonly debug: Observable<{ openList: TileNode, closedList: TileNode }>;

  constructor() {
    // Load game web worker
    if (typeof Worker !== 'undefined') {
      this._worker = new Worker('../worker/game.worker', { type: 'module' });
      this._worker.onmessage = ({ data }) => this._state.next(data);
    }

    this.players = this.state.pipe(
      map((state: GameState) => state.players),
      distinctUntilChanged((prev, next) => prev && (Object.keys(prev).length === Object.keys(next).length))
    );
    this.grid = this.state.pipe(
      map((state: GameState) => state.grid),
      // Update grid only when length changes
      distinctUntilChanged((prev, next) => prev && (prev.length === next.length))
    );
    this.size = this.state.pipe(
      filter((state: GameState) => !!state.grid && !!state.grid[0]),
      map((state: GameState) => ({
        width: state.grid.length * state.constants.tileSize,
        height: state.grid[0].length * state.constants.tileSize
      })),
      distinctUntilChanged()
    );
    this.constants = this.state.pipe(
      map((state: GameState) => state.constants),
      distinctUntilChanged()
    );
  }

  getNodeState(index: Index) {
    return this.state.pipe(
      map((state: GameState) => state.grid[index.x][index.y]),
      distinctUntilChanged()
    );
  }

  getPlayerState(name: string) {
    return this.state.pipe(
      map((state: GameState) => state.players[name]),
      distinctUntilChanged()
    );
  }

  newGame(rows: number, cols: number, debug: boolean, debugDelay: number) {
    this._worker.postMessage({ action: UserAction.GAME_NEW, payload: { data: mapData, rows, cols, debug, debugDelay } });
  }

  pauseGame() {
    // this.audio.pause.play();
    this._worker.postMessage({ action: UserAction.GAME_PAUSE });
  }

  resumeGame() {
    // this.audio.music.play();
    this._worker.postMessage({ action: UserAction.GAME_RESUME });
  }

  moveHero(target: Index) {
    this._worker.postMessage({ action: UserAction.HERO_MOVE, payload: { target } });
  }

  cloneHero() {
    this._worker.postMessage({ action: UserAction.HERO_CLONE });
  }
}
