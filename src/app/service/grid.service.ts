import {Injectable} from '@angular/core'
import {Http} from "@angular/http"
import {Subject} from "rxjs/Subject"
import {BehaviorSubject} from "rxjs/BehaviorSubject"
import {Observable} from "rxjs/Observable"
import {Store} from "@ngrx/store"

import {IGrid} from "./grid.interface"
import {PathFinder} from "../algorithm/pathfinder"
import {GameState} from "../store/game.state"
import {GameStore, GameMode, GameSettings}  from "../store/game.reducer"
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
import {AudioService} from "../audio/audio.service";

@Injectable()
export class GridService implements IGrid {

  /** Grid Tiles */
  grid: Tile[][];
  height: number;
  width: number;
  tileSize: number;

  /** Main character pointers */
  hero: Hero;
  guard: Guard;
  goal: Tile;
  /** Game players list */
  players: List<Player>;
  /** Game score */
  score: number;
  /** Game Timer (representing 5 min) */
  time: number;

  players$: List<Subject<any>>;
  autoPilot$: List<Observable<any>>;
  /** To stream only recent routes */
  routing$: Subject<any>;
  /** To unsubscribe from all streams when game is over. */
  gameOver$: Subject<any>;
  /** Game Pauser */
  pauser$: BehaviorSubject<boolean>;
  /** For attacking actions */
  attacking$: Subject<any>;

  constructor(private store: Store<GameState>, private http: Http, private audio: AudioService) {
    /** Pauser should be initialized here */
    this.pauser$ = new BehaviorSubject(false);
  }

  newGame(x: number, y: number, tileSize: number) {
    if (this.gameOver$) this.gameOver$.next(true);
    /** Prepare the grid */
    this.time = GameSettings.TIME;
    this.score = 0;
    this.tileSize = tileSize;
    this.width = x;
    this.height = y;
    this.grid = [];
    this.players = new List<Player>();
    this.players$ = new List<Subject<any>>();
    this.autoPilot$ = new List<Subject<any>>();
    this.routing$ = new Subject();
    this.attacking$ = new Subject();
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
    this.loadMap(x, y).subscribe();
  }

  pauseGame() {
    this.gameState(GameMode.PAUSED);
  }

  resumeGame() {
    this.gameState(GameMode.PLAYING);
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
    player.pilotIndex = this.autoPilot$.push(new Observable()) - 1;
    this.players.push(player);

    this.pauser$.switchMap(paused => paused ? Observable.never() : this.moveStream(player))
      .takeUntil(this.gameOver$).subscribe();
    this.pauser$.switchMap(paused => paused ? Observable.never() : this.pilotStream(player))
      .takeUntil(this.gameOver$).subscribe();
  }

  private loadMap(x, y) {
    return this.http.get(Helper.prefixUrl('../../assets/map/map.json')).map(res => res.json()).do(
      (res) => {
        res.map((object: Tile) => {
          if (object.index.x < x && object.index.y < y) {
            let tile = new Tile(object.index, object.walkable, object.sprite);
            tile.type += ' ' + object.type;
            this.grid[object.index.x][object.index.y] = tile;
          }
        });
        /** Set goal */
        this.goal = this.grid[0][0];
        this.goal.type += " flag";
        this.goal.sprite = Helper.prefixUrl(PlayerSprites.FLAG);
        /** Set hero */
        this.hero = new Hero({x: x - 1, y: y - 1});
        this.players.push(this.hero);
        this.hero.subjectIndex = this.players$.push(new Subject<Tile[]>()) - 1;
        /** Set Enemy */
        this.guard = new Guard({x: 0, y: 0});
        this.players.push(this.guard);
        this.guard.subjectIndex = this.players$.push(new Subject<Tile[]>()) - 1;
        this.guard.pilotIndex = this.autoPilot$.push(new Subject<Tile[]>()) - 1;
        /** Start Timer */
        this.pauser$.switchMap(paused => paused ? Observable.never() : this.timerStream(this.time))
          .takeUntil(this.gameOver$).subscribe();
        /** Start Routing */
        this.pauser$.switchMap(paused => paused ? Observable.never() : this.routingStream())
          .takeUntil(this.gameOver$).subscribe();
        /** Movement stream for all players */
        this.players.map((player) => {
          this.pauser$.switchMap(paused => paused ? Observable.never() : this.moveStream(player))
            .takeUntil(this.gameOver$).subscribe();
        });
        /** Auto-pilot (for the guard) */
        this.pauser$.switchMap(paused => paused ? Observable.never() : this.pilotStream(this.guard))
          .takeUntil(this.gameOver$).subscribe();
        /** Scanner (for the guard) */
        this.pauser$.switchMap(paused => paused ? Observable.never() : this.scanStream(this.guard))
          .takeUntil(this.gameOver$).subscribe();
        /** Attacking Stream (probably for the guard) */
        this.pauser$.switchMap(paused => paused ? Observable.never() : this.attackingStream())
          .takeUntil(this.gameOver$).subscribe();
      },
      (err) => console.warn('LOAD MAP: ', err),
      () => {
        this.gameState(GameMode.PLAYING);
        this.updateStore();
      }
    );
  }

  /** Move player one step */
  private moveStep(player: Player, target: Tile) {
    /** Set the player current tile to walkable and next tile to un-walkable */
    player.direction = Helper.getPlayerDirection(player, target);
    this.grid[player.index.x][player.index.y].walkable = true;
    target.walkable = false;
    player.index = target.index;
    player.state = PlayerStates.WALKING;
    this.updateStore();
  }

  /** Stream player's steps to target */
  private moveStream(player: Player) {
    /** Stream recent route */
    return this.players$[player.subjectIndex].switchMap((target) => {
      return Observable.timer(0, player.speed)
        .take(player.route.length)
        .map(() => player.route.pop())
        .do((nextTile) => {
            if (player === this.hero) {
              this.score += 50;
              if (Helper.hasSameIndex(nextTile, this.goal)) this.gameState(GameMode.WON);
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
              /** If guard is attacking target */
              if (target && player === this.guard && !player.route.length) {
                console.log("Something");
                let route = Helper.scan(this, this.guard, this.players, 1);
                if (route.length)
                  this.attacking$.next({attacker: player, victim: route[0].target});
              }
              /** Set player state to idle after he reaches the target */
              else player.state = PlayerStates.IDLE;

              this.updateStore();
            }, player.speed);
          });
    });
  }

  /** Move a player randomly in specific range */
  private pilotStream(player: Player) {
    /** Use 'repeat' instead of 'interval' to get new random interval every time */
    return Observable.timer(0, Helper.getRandomBetween(1000, 2500))
      .do(() => {
        if (player.action === PlayerActions.ATTACKING) return;
        let target = Helper.getRandomTarget(this, player, 3);
        if (this.autoPilot$[player.pilotIndex])
          this.routing$.next({player: player, target: target});
      })
      .repeat()
      .takeWhile(() => this.autoPilot$[player.pilotIndex] !== undefined);
  }

  /** Move player to target using PathFinder */
  private routingStream() {
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
        res.player.route = nextRoute;
        this.players$[res.player.subjectIndex].next();
      },
      (err) => {
        console.warn(err)
      }
    );
  }

  /** Scan for players in range (GUARD ONLY) */
  private scanStream(player: Player) {
    return Observable.timer(0, GameSettings.SCAN_INTERVAL).do(() => {

      let routes = Helper.scan(this, player, this.players, 5);
      if (routes.length) {
        player.action = PlayerActions.ATTACKING;
        /** Get the closest target */
        let res = routes.reduce((prev, next) => prev.route.length > next.route.length ? next : prev);
        /** Remove the target tile from next route */
        res.route.shift();
        player.route = res.route;
        this.players$[player.subjectIndex].next(res.target);
      }
      else
        player.action = PlayerActions.GUARDING;
    });
  }

  /** Game timer */
  private timerStream(duration: number) {
    return Observable.interval(1000).do((elapsed) => {
      /** Time left in seconds */
      this.time = duration - elapsed;
      if (this.time > 0) {
        let t = new Date(1970, 0, 1);
        t.setSeconds(this.time);
        this.store.dispatch({
          payload: t,
          type: GameStore.TIMER_TICK
        });
      }
      else this.gameState(GameMode.TIME_UP);
    })
  }

  private attackingStream() {
    return this.attacking$.exhaustMap(res => {
      /** Change attacker direction towards the victim */
      console.log("Attack Go");
      let attacker = res.attacker;
      let victim = res.victim;
      attacker.direction = Helper.getPlayerDirection(attacker, victim);
      let transform;
      switch (attacker.direction) {
        case PlayerDirections.TOP:
          transform = `translate(0, -${this.tileSize / 2}px)`;
          break;
        case PlayerDirections.BOTTOM:
          transform = `translate(0, ${this.tileSize / 2}px)`;
          break;
        case PlayerDirections.LEFT:
          transform = `translate(-${this.tileSize / 2}px, 0)`;
          break;
        case PlayerDirections.RIGHT:
          transform = `translate(${this.tileSize / 2}px, 0)`;
          break;
        default:
          transform = 'translate(0, 0)';
      }
      attacker.styles = Object.assign({}, attacker.styles, {transform: transform});

      return Observable.of(null).delay(attacker.speed).do(() => {
        console.log("Attack Back");
        attacker.styles = Object.assign({}, attacker.styles, {transform: 'translate(0, 0)'});
        /** Add blood effect */
        victim.blood = true;
        setTimeout(() => victim.blood = false, 1000);

        /** remove one life from victim & remove him if he has no more lives */
        if (victim.lives.length) {
          victim.lives.pop();
          if (!victim.lives.length) setTimeout(this.removePlayer(victim), 1000);
        }
        this.updateStore();
      });
    });
  }

  private removePlayer(player: Player) {
    /** Remove & Unsubscribe automatically */
    this.audio.dead();
    if (player.pilotIndex)
      this.autoPilot$.remove(this.autoPilot$[player.pilotIndex]);

    this.players$.remove(this.players$[player.subjectIndex]);
    this.grid[player.index.x][player.index.y].walkable = true;
    this.players.remove(player);


    if (player === this.hero) this.gameState(GameMode.LOST);
  }

  private gameState(mode) {
    this.pauser$.next(mode !== GameMode.PLAYING);
    this.store.dispatch({
      type: GameStore.GAME_STATE,
      payload: mode
    });
    if (mode !== GameMode.PAUSED && mode !== GameMode.PLAYING) this.gameOver$.next();
  }

  private updateStore() {
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

}


