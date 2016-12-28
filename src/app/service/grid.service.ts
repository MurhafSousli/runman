import {Injectable} from '@angular/core'
import {Http} from "@angular/http"
import {Subject} from "rxjs/Subject"
import {BehaviorSubject} from "rxjs/BehaviorSubject"
import {Observable} from "rxjs/Observable"
import {Store} from "@ngrx/store"

import {IGrid} from "./grid.interface"
import {PathFinder} from "../algorithm/pathfinder"
import {GameState} from "../store/game.state"
import {GameStore, GameModal}  from "../store/game.reducer"
import {
  Tile,
  Hero,
  Guard,
  Player,
  PlayerStates,
  PlayerActions,
  PlayerDirections,
  PlayerRoute,
  PlayerSprites
} from "../models"

import {Helper} from "./grid.helper"
import {List} from "../algorithm/list.class";

@Injectable()
export class GridService implements IGrid {

  /** Grid Tiles */
  grid: Tile[][];
  height: number;
  width: number;
  tileSize: number;

  /** Those are just pointers */
  hero: Hero;
  guard: Guard;
  goal: Tile;

  /** Game players list */
  players: List<Player>;

  /** Game score */
  score: number;

  players$: List<Subject<any>>;
  autoPilot$: List<Observable<any>>;
  /** To stream only recent routes */
  routing$: Subject<any>;
  /** To unsubscribe from all streams when game is over. */
  gameOver$: Subject<any>;
  /** Game Pauser */
  pauser$: BehaviorSubject<boolean>;

  constructor(private store: Store<GameState>, private http: Http) {
    this.newGame(12, 10, 50);
  }

  newGame(x: number, y: number, tileSize: number) {
    /** Prepare the grid */
    this.pauser$ = new BehaviorSubject(false);

    this.score = 0;
    this.tileSize = tileSize;
    this.width = x;
    this.height = y;
    this.grid = [];
    this.players = new List<Player>();
    this.players$ = new List<Subject<any>>();
    this.autoPilot$ = new List<Observable<any>>();
    this.routing$ = new Subject();
    this.gameOver$ = new Subject();

    /** Draw the base */
    for (let i = 0; i < x; i++) {
      this.grid[i] = [];
      for (let j = 0; j < y; j++) {
        let tile = new Tile({x: i, y: j}, true);
        this.grid[i].push(tile);
      }
    }
    /** Load the map */
    this.http.get(Helper.prefixUrl('../../assets/map/map.json')).map(res => res.json()).subscribe(
      (res) => {
        res.map((object) => {
          let tile = new Tile(object.index, object.walkable, object.image);
          tile.type += ' ' + object.type;
          this.grid[object.index.x][object.index.y] = tile;
        });

        this.pauser$.switchMap(paused => paused ? Observable.never() : this.startTimer(5 * 60))
          .takeUntil(this.gameOver$)
          .subscribe();
        /** Set goal */
        this.goal = this.grid[0][0];
        /** Set hero */
        this.hero = new Hero({x: x - 1, y: y - 1});
        this.players.push(this.hero);
        this.hero.subjectIndex = this.players$.push(new Subject<Tile[]>()) - 1;
        /** Set Enemy */
        this.guard = new Guard({x: 0, y: 0});
        this.players.push(this.guard);
        this.guard.subjectIndex = this.players$.push(new Subject<Tile[]>()) - 1;
        this.guard.pilotIndex = this.autoPilot$.push(this.takeAWalk(this.guard)) - 1;

        this.pauser$.switchMap(paused => paused ? Observable.never() : this.activateMoves())
          .takeUntil(this.gameOver$).subscribe();

        /** Activate Moving stream mode for all players */
        this.players.map((player) => {
          this.pauser$.switchMap(paused => paused ? Observable.never() : this.activatePlayerMoves(player))
            .takeUntil(this.gameOver$).subscribe();
        });
        /** Activate Auto-pilot mode for players (except the hero) */
        this.autoPilot$.map(pilot => {
          this.pauser$.switchMap(paused => paused ? Observable.never() : pilot).takeUntil(this.gameOver$).subscribe()
        });

        this.pauser$.switchMap(paused => paused ? Observable.never() : this.scanner())
          .takeUntil(this.gameOver$).subscribe();

      },
      (err) => console.warn(err),
      () => {
        this.updateStore();
      }
    );
  }

  pauseGame() {
    this.gameOver(GameModal.PAUSED);
  }

  moveHero(index) {
    let target = this.grid[index.x][index.y];
    this.routing$.next({player: this.hero, target: target});
  }

  cloneHero() {
    /** Get random close place in range of 1 */
    let target = Helper.getRandomTarget(this, this.hero, 2);
    /** Add fake hero to the target */
    let player = new Player({x: target.index.x, y: target.index.y}, PlayerSprites.BOY, 'hero');
    player.subjectIndex = this.players$.push(new Subject<Tile[]>()) - 1;
    player.pilotIndex = this.autoPilot$.push(this.takeAWalk(this.guard)) - 1;
    this.players.push(player);

    this.pauser$.switchMap(paused => paused ? Observable.never() : this.activatePlayerMoves(player))
      .takeUntil(this.gameOver$).subscribe();
    this.pauser$.switchMap(paused => paused ? Observable.never() : this.takeAWalk(player))
      .takeUntil(this.gameOver$).subscribe();
  }

  /** Stream player's steps to target */
  private activatePlayerMoves(player: Player) {
    /** Stream recent route tiles */
    return this.players$[player.subjectIndex].switchMap((res) => {
      return Observable
        .timer(0, player.speed)
        .take(res.route.length)
        .map(() => res.route.pop())
        .timeInterval()
        .do((next) => {
            let nextTile = next.value;
            if (player === this.hero) {
              this.score += 50;
              if (JSON.stringify(nextTile.index) === JSON.stringify(this.goal.index)) {
                /** TODO: Check if score is enough to win */
                this.gameOver(GameModal.WON);
              }
            }
            /** If target became un-walkable get a new route */
            if (!nextTile.walkable) {
              this.routing$.next({player: player, target: nextTile});
              return;
            }
            /** Otherwise move to the next tile */
            this.moveStep(player, nextTile);
          },
          (err) => {
            console.warn(err);
          },
          () => {
            setTimeout(() => {
              /** Check if the route has a player target (Attacking) */
              if (res.target && player === this.guard && !res.route.length) {
                let route = Helper.scan(this, this.guard, this.players, 1);
                if (route.length)
                  this.attack(this.guard, route[0].target);
              }
              /** Set player state to idle after he reaches the target */
              player.state = PlayerStates.IDLE;
              this.updateStore();
            }, player.speed);
          });
    });
  }

  /** Move player to target using PathFinder */
  private activateMoves() {
    return this.routing$.do((res: PlayerRoute) => {
        /** Set player's tile to walkable for the PathFinder */
        let start = this.grid[res.player.index.x][res.player.index.y];
        start.walkable = true;

        let nextRoute = PathFinder.searchPath(this, start, res.target);
        /** if there is no route set player's tile to un-walkable */
        if (!nextRoute.length) {
          start.walkable = false;
          return;
        }
        this.players$[res.player.subjectIndex].next({route: nextRoute});
      },
      (err) => {
        console.warn(err)
      }
    );
  }

  /** Scan for players in range */
  private scanner() {
    return Observable.of(null)
      .concatMap(() => Observable.timer(800))
      .do(() => {
        let routes = Helper.scan(this, this.guard, this.players, 5);

        if (routes.length) {
          /** Get the closest target */
          let res = routes.reduce((prev, next) => prev.route.length > next.route.length ? next : prev);
          /** Remove the first tile (Target tile) */
          let target = res.route[0];
          res.route.shift();
          this.guard.action = PlayerActions.ATTACKING;
          this.players$[this.guard.subjectIndex].next({route: res.route, target: target});
        }
        else {
          /** If not target is close take a walk */
          this.guard.action = PlayerActions.GUARDING;
        }
      })
      .repeat();
  }

  /** Take a walk: Move a player randomly 3 tiles range */
  private takeAWalk(player: Player) {
    return Observable.of(null)
      .concatMap(() => Observable.timer(Helper.getRandomBetween(1000, 2500)))
      .do(() => {
        if (player.action === PlayerActions.ATTACKING) return;
        let target = Helper.getRandomTarget(this, player, 3);
        if (target.walkable) this.routing$.next({player: player, target: target});
      })
      .repeat();
  }

  /** Game Timer: calculate time left */
  private startTimer(duration: number) {
    return Observable.of(null)
      .concatMap(() => {
        return Observable
          .interval(1000)
          .timeInterval()
          .do((x) => {
            /** Time left in seconds */
            let time = duration - x.value;
            if (time > 0) {
              let t = new Date(1970, 0, 1);
              t.setSeconds(time);
              this.store.dispatch({
                payload: t,
                type: GameStore.TIMER_TICK
              });
            }
            else this.gameOver(GameModal.TIME_UP);
          })
          .share();
      })
  }

  moveStep(player: Player, target: Tile) {
    player.direction = Helper.getPlayerDirection(player, target);
    /** Set the player current tile to walkable */
    this.grid[player.index.x][player.index.y].walkable = true;
    /** Set the player future tile to un-walkable */
    target.walkable = false;
    player.index = target.index;
    player.state = PlayerStates.WALKING;
    this.updateStore();
  }

  attack(attacker: Player, victim: Player) {
    /** Change attacker direction towards the victim */
    attacker.direction = Helper.getPlayerDirection(attacker, victim);
    switch (attacker.direction) {
      case PlayerDirections.TOP:
        attacker.styles.transform = `translate(0, -${this.tileSize / 2}px)`;
        break;
      case PlayerDirections.BOTTOM:
        attacker.styles.transform = `translate(0, ${this.tileSize / 2}px)`;
        break;
      case PlayerDirections.LEFT:
        attacker.styles.transform = `translate(-${this.tileSize / 2}px, 0)`;
        break;
      case PlayerDirections.RIGHT:
        attacker.styles.transform = `translate(${this.tileSize / 2}px, 0)`;
        break;
      default:
        attacker.styles.transform = 'translate(0, 0)';
    }

    setTimeout(() => {
      attacker.styles.transform = 'translate(0, 0)';
      /** remove one life from victim & remove him if he has no more lives */
      if (victim.lives.length) {
        victim.lives.pop();
        if (!victim.lives.length) setTimeout(this.removePlayer(victim), victim.speed * 2);
      }
    }, attacker.speed / 2);
    /** Add blood effect */
    victim.blood = true;
    this.updateStore();
    setTimeout(() => {
      victim.blood = false;
    }, 1000);

  }

  removePlayer(player: Player) {
    /** Remove & Unsubscribe */
    if (player.pilotIndex) {
      let pilot = this.autoPilot$[player.pilotIndex];
      this.autoPilot$.remove(pilot);
    }
    let playerMoves = this.players$[player.subjectIndex];
    // this.players$.remove(playerMoves)[0].unsubscribe();
    this.players.remove(player);

    if (player === this.hero)
      this.gameOver(GameModal.LOST);
  }

  updateStore() {
    this.store.dispatch({
      payload: {
        grid: this.grid,
        hero: this.hero,
        guard: this.guard,
        players: this.players,
        score: this.score
      },
      type: ''
    });
  }

  gameOver(mode) {
    this.pauser$.next(!this.pauser$.getValue());
    this.store.dispatch({
      type: GameStore.GAME_OVER,
      payload: mode
    });
    if (mode !== GameModal.PAUSED)
      this.gameOver$.next();
  }

}


