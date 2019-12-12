import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { GameState, Index, MovingState, GameMode, PlayerSprites } from '../models';
import { GameMap, Tile, Hero, Guard } from '../classes';
import { Player } from '../classes/player';

const INITIAL_STATE: GameState = {
  constants: {
    scanInterval: 800,
    tileSize: 50
  },
  grid: null,
  players: null,
  timeLeft: null,
  score: 0,
  status: GameMode.PLAYING
};

export class GameEngine {

  hero: Hero;
  guard: Guard;
  goal: Tile;
  game: GameMap;

  debug: boolean;
  debugDelay: number;

  // State stream
  state = new BehaviorSubject(INITIAL_STATE);
  // Destroyer stream
  destroyed = new Subject();

  updateState = (state: GameState) => {
    this.state.next({ ...this.state.value, ...state });
  };

  create({ data, rows, cols, debug, debugDelay }: { data: any, rows: number, cols: number, debug: boolean, debugDelay: number }): void {
    this.debug = debug;
    this.debugDelay = debugDelay;

    const currState = this.state.value;
    // Create Map
    this.game = new GameMap({ data, rows, cols });
    // Create Hero
    this.hero = new Hero({
      index: { x: 8, y: 9 },
      gameMap: this.game,
      size: currState.constants.tileSize,
      updateGameState: this.updateState
    });
    // Create Guard
    this.guard = new Guard({
      index: { x: 5, y: 5 },
      gameMap: this.game,
      size: currState.constants.tileSize,
      updateGameState: this.updateState
    });
    // Create Goal
    this.goal = this.game.getTile({ x: 0, y: 0 });
    if (this.goal) {
      this.goal.sprite = PlayerSprites.FLAG;
    }
    // Get reference to all players
    this.updateState({
      grid: this.game.grid.map((arr) => arr.map((tile: Tile) => tile.state)),
      timeLeft: '',
      players: {
        hero: this.hero.state,
        guard: this.guard.state
      }
    });

    // this.hero.moving.pipe(
    //   tap((state: MovingState) => {
    //     console.log('hero moving', state);
    //     /*
    //      *  Set the next tile's walkable property to false
    //      */
    //     const playerTile = this.game.getTile(state.player.index);
    //     playerTile.walkable = false;
    //     this.updateState({
    //       players: {
    //         ...currState.players, ...{
    //           hero: state.player
    //         }
    //       }
    //     });
    //     // Check if hero has reached the goal
    //     if (compareIndex(state.player.index, this.goal.state.index)) {
    //       console.log('Goal reached!');
    //       this.updateState({
    //         status: 'finished'
    //       });
    //     }
    //   })
    // ).subscribe();
  }

  resume() {
  }

  pause() {
  }

  moveHero(target: Index) {
    this.hero.move(target);
  }

  cloneHero() {
  }

  destroy() {
    this.destroyed.next();
  }


  /**
   * Move player to target using PathFinder
   */
  // private routingStream(player: Player, target) {
  //   return this.routing$.pipe(
  //     tap((res) => {
  //         /** Set player's tile to walkable for the PathFinder */
  //         const start = this.map.getTile(player.index.ts);
  //         start.walkable = true;
  //
  //         const nextRoute = searchPath(this.map.grid, start, target, this.state.value.view.width, this.state.value.view.height);
  //         /** if there is no route set player's tile to un-walkable */
  //         if (nextRoute && nextRoute.length) {
  //           player.route = nextRoute;
  //           this.players$[res.player.routingIndex].next();
  //         } else {
  //           start.walkable = false;
  //         }
  //       },
  //       (err) => {
  //         console.warn(err);
  //       }
  //     )
  //   );
  // }


  /**
   * Stream player's steps to target
   */
  private getWalkingStream(player: Player, route: any, target: Index): Observable<MovingState> {
    return timer(0, player.speed).pipe(
      take(route.length),
      map(() => route.pop()),
      map((nextTile: Tile) => {
        // If next time became un-walkable before player reaches, get a new route
        if (!nextTile.walkable) {
          // player.move(target);
          return null;
        } else {
          // Otherwise forward moving state
          return { player: player.state, target };
        }
      }),
      filter((state) => !!state),
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
    );
  }
}



