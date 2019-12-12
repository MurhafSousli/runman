import { EMPTY, Subject, timer } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

import { MapObject } from './object';
import { Tile, TileNode } from './tile';
import { GameState, Index, PlayerState, PlayerStates } from '../models';
import { PathFinder } from '../path-finder/path-finder';
import { GameMap } from './map';

export interface PlayerParams {
  type?: string;
  index?: Index;
  sprite?: string;
  className?: string;
  gameMap?: GameMap;
  size?: number;
  updateGameState?: (state: GameState) => void;
}

export class Player extends MapObject {
  type: string;
  // Player physical state {idle, walking, dead}
  status: string;
  // Player action state
  action: string;
  // Player sprite direction
  direction: string;
  // Player's Routing Index
  routingIndex: number;
  // Player Auto-Pilot Index
  bot: boolean;
  // Player moving speed in ms
  speed: number;
  // Player lives
  lives: boolean[];
  // Player blood effect
  blood: boolean;
  // Player route color
  color: string;

  protected _pathFinder: PathFinder;

  protected _moving = new Subject<Index>();

  // Expose player state to game state
  get state(): PlayerState {
    return {
      status: this.status,
      action: this.action,
      direction: this.direction,
      bot: this.bot,
      speed: this.speed,
      lives: this.lives,
      blood: this.blood,
      color: this.color,
      sprite: this.sprite,
      className: this.className,
      index: this.index,
      styles: this.styles
    };
  }

  private get styles(): any {
    return {
      left: this.index.x * this.size + 'px',
      top: this.index.y * this.size + 'px',
      width: this.size + 'px',
      height: this.size + 'px',
      transition: `all linear ${this.speed}ms`
    };
  }

  constructor(params: PlayerParams) {
    super({
      ...params,
      ...{
        className: params.className ? `player ${params.className}` : 'player',
      }
    });
    this.status = PlayerStates.IDLE;
    this.speed = 300;
    this.lives = [true];
    this.color = 'rgba(196, 193, 49, .8)';
    this.bot = true;

    this._pathFinder = new PathFinder(params.gameMap.grid, params.updateGameState);

    this._moving.pipe(
      switchMap((target: Index) => {
        const srcTile = params.gameMap.getTile(this.index);
        const endTile = params.gameMap.getTile(target);
        // Get the route to target from the path finder
        return this._pathFinder.findPath(srcTile.node, endTile.node).pipe(
          switchMap((route: Tile[]) => route.length ? this.getWalkingStream(route, params.updateGameState) : EMPTY),
          catchError((err: Error) => {
            console.error('[Path Finder]: ', err.message);
            return EMPTY;
          })
        );
      }),
    ).subscribe();
  }

  /**
   * Move player to target
   */
  move(target: Index) {
    this._moving.next(target);
  }

  /**
   * Stream player's steps to target
   */
  private getWalkingStream(route: TileNode[], updateGameState: (state: GameState) => void) {
    console.log('Start walking...', route);
    return timer(0, this.speed).pipe(
      take(route.length),
      map(() => route.pop()),
      tap((nextTile: TileNode) => {
        // If next time became un-walkable before player reaches, get a new route
        if (!nextTile.walkable) {
          // this.move(nextTile);
        } else {
          // Otherwise forward moving state
          this.index = nextTile.index;
          // this.direction = nextTile.direction;
          updateGameState({ players: { [this.type]: this.state } });
        }
      })
    );
  }

  // finalize(() => {
  //   of(null).pipe(
  //     delay(this._speed),
  //     tap(() => {
  //       /** If guard is attacking target */
  //       if (target && player === this.guard && !player.route.length) {
  //         const route = scan(this, this.guard, this.players, 1);
  //         if (route.length) {
  //           this.attacking$.next({ attacker: player, victim: route[0].target });
  //         }
  //       } else {
  //         /** Set player state to idle after he reaches the target */
  //         player.state = PlayerStates.IDLE;
  //       }
  //
  //       this.updateStore();
  //     })
  //   ).subscribe();
  // })
}
