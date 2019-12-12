// import { Injectable } from '@angular/core';
// import { BehaviorSubject, EMPTY, interval, of, Subject, timer } from 'rxjs';
// import { delay, exhaustMap, finalize, map, switchMap, take, takeWhile, tap } from 'rxjs/operators';
//
// import { GameMode, PlayerActions, PlayerSprites, PlayerStates } from './models/game.constants';
// import { addPlayer, attackEffect, removePlayer, setPlayerDirection } from '../player/player';
// import { compareIndex, getRandomBetween, getRandomTarget, scan } from '../map/map';
// import { Guard, Hero, Tile, Player } from './models/game.models';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class GameService {
//
//   /** Grid Tiles */
//   grid: Tile[][];
//   height: number;
//   width: number;
//   tileSize: number;
//
//   /** Main characters */
//   hero: Hero;
//   guard: Guard;
//   goal: Tile;
//   /** Game players list */
//   players: { [id: string]: Player };
//   /** Game score */
//   score: number;
//   /** Game Timer */
//   time: number;
//
//   /** To pause the game */
//   pauser$: BehaviorSubject<boolean>;
//   /** To stream only recent routes to players */
//   players$: { [id: string]: Subject<any> };
//   /** To get routes from pathfinder */
//   routing$: Subject<any>;
//   /** To unsubscribe from all streams when game is over. */
//   gameOver$: Subject<any>;
//   /** For attacking actions */
//   attacking$: Subject<any>;
//
//   constructor() {
//   }
//
//   newGame(mapData, x: number, y: number) {
//     /** Initialize Pauser/close modal if open */
//     this.pauser$ = new BehaviorSubject(false);
//     /** Unsubscribe from all streams */
//     if (this.gameOver$) {
//       this.gameOver$.next(true);
//     }
//     // this.audio.music.play();
//     /** Prepare the grid, initialize all variables */
//     this.grid = [];
//     this.width = x;
//     this.height = y;
//     this.tileSize = GameSettings.TILE_SIZE;
//     this.time = GameSettings.TIME;
//     this.score = 0;
//     this.players = {};
//     this.players$ = {};
//     this.routing$ = new Subject();
//     this.attacking$ = new Subject();
//     this.gameOver$ = new Subject();
//     /** Draw the grid */
//     for (let i = 0; i < x; i++) {
//       this.grid[i] = [];
//       for (let j = 0; j < y; j++) {
//         this.grid[i].push(new Tile({ x: i, y: j }, true));
//       }
//     }
//     /** Load the map */
//     this.loadMap(mapData).subscribe();
//   }
//
//   pauseGame() {
//     // this.audio.pause.play();
//     this.gameState(GameMode.PAUSED);
//   }
//
//   resumeGame() {
//     // this.audio.music.play();
//     this.gameState(GameMode.PLAYING);
//   }
//
//   moveHero(index.ts) {
//     const target = this.grid[index.ts.x][index.ts.y];
//     if (target.walkable) {
//       this.routing$.next({ player: this.hero, target });
//     }
//   }
//
//   addBot() {
//     const target = getRandomTarget(this, this.hero, 2);
//     const player = new Player(target.index.ts, PlayerSprites.BOY, 'hero');
//     addPlayer(this, player);
//   }
//
//   private loadMap(data: Tile[]) {
//     data.map((t: Tile) => {
//       if (t.index.ts.x < this.width && t.index.ts.y < this.height) {
//         const tile = new Tile(t.index.ts, t.walkable, t.sprite);
//         tile.type += ' ' + t.type;
//         this.grid[t.index.ts.x][t.index.ts.y] = tile;
//       }
//     });
//     /** Set goal */
//     this.goal = this.grid[0][0];
//     this.goal.type += ' flag';
//     this.goal.sprite = PlayerSprites.FLAG;
//
//     /** Add hero */
//     this.hero = new Hero({ x: 1, y: 9 });
//     addPlayer(this, this.hero);
//
//     /** Add guard */
//     this.guard = new Guard({ x: 0, y: 0 });
//     addPlayer(this, this.guard);
//
//     /** Start timer */
//     this.pauser$.pipe(switchMap(paused => paused ? EMPTY : this.timerStream(this.time)));
//
//     /** Start routing */
//     this.pauser$.pipe(switchMap(paused => paused ? EMPTY : this.routingStream()));
//
//     /** Attacking stream (for the guard) */
//     this.pauser$.pipe(switchMap(paused => paused ? EMPTY : this.attackingStream()));
//
//     /** Scanner (for the guard) */
//     this.pauser$.pipe(switchMap(paused => paused ? EMPTY : this.scanStream(this.guard)));
//
//     this.gameState(GameMode.PLAYING);
//     this.updateStore();
//   }
//
//   /** Move player one step */
//   private moveStep(player: Player, target: Tile) {
//     /** Set the player current tile to walkable and next tile to un-walkable */
//     setPlayerDirection(player, target);
//     this.grid[player.index.ts.x][player.index.ts.y].walkable = true;
//     target.walkable = false;
//     player.index.ts = target.index.ts;
//     player.state = PlayerStates.WALKING;
//     this.updateStore();
//   }
//
//   /** Stream player's steps to target */
//   moveStream(player: Player) {
//     /** Stream recent route */
//     return this.players$[player.routingIndex].pipe(
//       switchMap((target) => {
//         return timer(0, player.speed).pipe(
//           take(player.route.length),
//           map(() => player.route.pop()),
//           tap((nextTile) => {
//               if (player === this.hero) {
//                 this.score += 50;
//                 if (compareIndex(nextTile, this.goal)) {
//                   this.gameState(GameMode.WON);
//                 }
//               }
//               /** If target became un-walkable get a new route */
//               if (!nextTile.walkable) {
//                 this.routing$.next({ player, target: nextTile });
//               } else {
//                 /** Otherwise move to the next tile */
//                 this.moveStep(player, nextTile);
//               }
//             }
//           ),
//           finalize(() => {
//             of(null).pipe(
//               delay(player.speed),
//               tap(() => {
//                 /** If guard is attacking target */
//                 if (target && player === this.guard && !player.route.length) {
//                   const route = scan(this, this.guard, this.players, 1);
//                   if (route.length) {
//                     this.attacking$.next({ attacker: player, victim: route[0].target });
//                   }
//                 } else {
//                   /** Set player state to idle after he reaches the target */
//                   player.state = PlayerStates.IDLE;
//                 }
//
//                 this.updateStore();
//               })
//             ).subscribe();
//           })
//         );
//       })
//     );
//   }
//
//   /** Move a player randomly in specific range */
//   pilotStream(player: Player) {
//     return timer(0, getRandomBetween(1200, 2500)).pipe(
//       tap(() => {
//         if (player.action === PlayerActions.ATTACKING) {
//           return;
//         }
//         const target = getRandomTarget(this, player, 3);
//         if (this.players$[player.routingIndex]) {
//           this.routing$.next({ player, target });
//         }
//       }),
//       takeWhile(() => this.players.contains(player))
//     );
//   }
//
//   /** Move player to target using PathFinder */
//   private routingStream() {
//     return this.routing$.pipe(
//       tap((res) => {
//           /** Set player's tile to walkable for the PathFinder */
//           const start = this.grid[res.player.index.ts.x][res.player.index.ts.y];
//           start.walkable = true;
//
//           const nextRoute = PathFinder.searchPath(this, start, res.target);
//           /** if there is no route set player's tile to un-walkable */
//           if (nextRoute && nextRoute.length) {
//             res.player.route = nextRoute;
//             this.players$[res.player.routingIndex].next();
//           } else {
//             start.walkable = false;
//           }
//         },
//         (err) => {
//           console.warn(err);
//         }
//       )
//     );
//   }
//
//   /** Scan for players in range (GUARD ONLY) */
//   private scanStream(player: Player) {
//     return timer(0, GameSettings.SCAN_INTERVAL).pipe(
//       tap(() => {
//         const routes = scan(this, player, this.players, 5);
//         if (routes.length) {
//           player.action = PlayerActions.ATTACKING;
//           /** Get the closest target */
//           const res = routes.reduce((prev, next) => prev.route.length > next.route.length ? next : prev);
//           if (res.route) {
//             /** Remove the target tile from next route */
//             res.route.shift();
//             player.route = res.route;
//             this.players$[player.routingIndex].next(res.target);
//           }
//         } else {
//           player.action = PlayerActions.GUARDING;
//         }
//       })
//     );
//   }
//
//   /** Game timer */
//   private timerStream(duration: number) {
//     return interval(1000).pipe(
//       tap((elapsed) => {
//         /** Time left in seconds */
//         this.time = duration - elapsed;
//         if (this.time > 0) {
//           const t = new Date(1970, 0, 1);
//           t.setSeconds(this.time);
//           // this.store.dispatch({
//           //   payload: t,
//           //   type: GameStore.TIMER_TICK
//           // });
//         } else {
//           this.gameState(GameMode.TIME_UP);
//         }
//       })
//     );
//   }
//
//   /** player attack another player */
//   private attackingStream() {
//     return this.attacking$.pipe(
//       exhaustMap(res => {
//         /** Change attacker direction towards the victim */
//         const attacker = res.attacker;
//         const victim = res.victim;
//         attackEffect(this, attacker, victim);
//
//         return of(null).pipe(
//           delay(attacker.speed),
//           tap(() => {
//             attacker.styles = Object.assign({}, attacker.styles, { transform: 'translate(0, 0)' });
//             attacker.state = PlayerStates.IDLE;
//             /** Add blood effect & remove after 1 second */
//             victim.blood = true;
//
//             /** remove one life from victim & remove him if he has no more lives */
//             if (victim.lives.length) {
//               victim.lives.pop();
//               if (!victim.lives.length) {
//                 removePlayer(this, victim);
//               }
//             }
//             this.updateStore();
//           })
//         );
//       })
//     );
//   }
//
//   gameState(mode) {
//     // this.store.dispatch({
//     //   type: GameStore.GAME_STATE,
//     //   payload: mode
//     // });
//
//     const pause = () => {
//       this.pauser$.next(true);
//       // this.audio.music.pause();
//     };
//
//     const gameOver = () => {
//       this.gameOver$.next();
//       // this.audio.gameOver.play();
//     };
//
//     switch (mode) {
//       case GameMode.PAUSED:
//         pause();
//         break;
//       case GameMode.ABOUT:
//         pause();
//         break;
//       case GameMode.WON:
//         pause();
//         this.gameOver$.next();
//         // this.audio.win.play();
//         break;
//       case GameMode.LOST:
//         pause();
//         gameOver();
//         break;
//       case GameMode.TIME_UP:
//         pause();
//         gameOver();
//         break;
//       default:
//         this.pauser$.next(false);
//         break;
//     }
//
//     // /** Pause the game on about modal */
//     // if (mode === GameMode.ABOUT) {
//     //   this.pauser$.next(true);
//     //   return;
//     // }
//     //
//     //
//     // let isPlaying = (mode === GameMode.PLAYING);
//     // this.pauser$.next(!isPlaying);
//     //
//     // if (isPlaying) return;
//     // if (mode !== GameMode.PAUSED) {
//     //   this.gameOver$.next();
//     //   (mode === GameMode.TIME_UP || mode === GameMode.LOST) ? this.audio.gameOver.play() : this.audio.win.play();
//     // }
//     // this.audio.music.pause();
//   }
//
//   private updateStore() {
//     // this.store.dispatch({
//     //   payload: {
//     //     grid: this.grid,
//     //     hero: this.hero,
//     //     guard: this.guard,
//     //     players: this.players,
//     //     score: this.score
//     //   },
//     //   type: GameStore.UPDATE_STORE
//     // });
//   }
// }
