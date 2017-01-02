import {Injectable} from '@angular/core'
import {Http} from "@angular/http"
import {Subject} from "rxjs/Subject"
import {BehaviorSubject} from "rxjs/BehaviorSubject"
import {Observable} from "rxjs/Observable"
import {Store} from "@ngrx/store"

import {GameState} from "../store/game.state";
import {AudioService} from "../audio/audio.service"
import {Helper} from "../helpers/helper"
import {List} from "../helpers/list.class"
import {IGame} from "./game.interface"
import {PathFinder} from "../algorithm/pathfinder"
import {Tile, Hero, Guard, Player} from "../models"
import {
  GameStore,
  GameMode,
  GameSettings,
  PlayerSprites,
  PlayerStates,
  PlayerActions,
  PlayerDirections
} from "../store/game.const"

@Injectable()
export class GameService implements IGame {

  /** Grid Tiles */
  grid: Tile[][];
  height: number;
  width: number;
  tileSize: number;

  /** Main characters */
  hero: Hero;
  guard: Guard;
  goal: Tile;
  /** Game players list */
  players: List<Player>;
  /** Game score */
  score: number;
  /** Game Timer */
  time: number;

  /** To pause the game */
  pauser$: BehaviorSubject<boolean>;
  /** To stream only recent routes to players */
  players$: List<Subject<any>>;
  /** To get routes from pathfinder */
  routing$: Subject<any>;
  /** To unsubscribe from all streams when game is over. */
  gameOver$: Subject<any>;
  /** For attacking actions */
  attacking$: Subject<any>;

  constructor(private store: Store<GameState>, private http: Http, private audio: AudioService) {
    /** Pauser should be initialized here */
    this.pauser$ = new BehaviorSubject(false);
  }

  newGame(x: number, y: number) {
    if (this.gameOver$) this.gameOver$.next(true);
    /** Prepare the grid, initialize all variables */
    this.grid = [];
    this.width = x;
    this.height = y;
    this.tileSize = GameSettings.TILE_SIZE;
    this.time = GameSettings.TIME;
    this.score = 0;
    this.players = new List<Player>();
    this.players$ = new List<Subject<any>>();
    this.routing$ = new Subject();
    this.attacking$ = new Subject();
    this.gameOver$ = new Subject();
    /** Draw the grid */
    for (let i = 0; i < x; i++) {
      this.grid[i] = [];
      for (let j = 0; j < y; j++)
        this.grid[i].push(new Tile({x: i, y: j}, true));
    }
    /** Load the map */
    this.loadMap().subscribe();
  }

  pauseGame() {
    this.gameState(GameMode.PAUSED);
  }

  resumeGame() {
    this.gameState(GameMode.PLAYING);
  }

  moveHero(index) {
    let target = this.grid[index.x][index.y];
    if (target.walkable) this.routing$.next({player: this.hero, target: target});
  }

  addBot() {
    let target = Helper.getRandomTarget(this, this.hero, 2);
    let player = new Player(target.index, PlayerSprites.BOY, 'hero');
    this.addPlayer(player);
  }

  private loadMap() {
    return this.http.get(Helper.prefixUrl('../../assets/map/map.json'))
      .map(res => res.json())
      .do((res) => {
          res.map((t: Tile) => {
            if (t.index.x < this.width && t.index.y < this.height) {
              let tile = new Tile(t.index, t.walkable, t.sprite);
              tile.type += ' ' + t.type;
              this.grid[t.index.x][t.index.y] = tile;
            }
          });
          /** Set goal */
          this.goal = this.grid[0][0];
          this.goal.type += " flag";
          this.goal.sprite = Helper.prefixUrl(PlayerSprites.FLAG);

          /** Add hero */
          this.hero = new Hero({x: this.width - 1, y: this.height - 1});
          this.addPlayer(this.hero);

          /** Add guard */
          this.guard = new Guard({x: 0, y: 0});
          this.addPlayer(this.guard);

          /** Start timer */
          this.pauser$.switchMap(paused => paused ? Observable.never() : this.timerStream(this.time))
            .takeUntil(this.gameOver$).subscribe();

          /** Start routing */
          this.pauser$.switchMap(paused => paused ? Observable.never() : this.routingStream())
            .takeUntil(this.gameOver$).subscribe();

          /** Attacking stream (for the guard) */
          this.pauser$.switchMap(paused => paused ? Observable.never() : this.attackingStream())
            .takeUntil(this.gameOver$).subscribe();

          /** Scanner (for the guard) */
          this.pauser$.switchMap(paused => paused ? Observable.never() : this.scanStream(this.guard))
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
    return this.players$[player.routingIndex].switchMap((target) => {
      return Observable
        .timer(0, player.speed)
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
                let route = Helper.scan(this, this.guard, this.players, 1);
                if (route.length) this.attacking$.next({attacker: player, victim: route[0].target});
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
    return Observable
      .timer(0, Helper.getRandomBetween(1200, 2500))
      .do(() => {
        if (player.action === PlayerActions.ATTACKING) return;
        let target = Helper.getRandomTarget(this, player, 3);
        if (this.players.contains(player))
          this.routing$.next({player: player, target: target});
      })
      .repeat()
      .takeWhile(() => this.players.contains(player));
  }

  /** Move player to target using PathFinder */
  private routingStream() {
    return this.routing$.do((res) => {
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
        this.players$[res.player.routingIndex].next();
      },
      (err) => {
        console.warn(err)
      }
    );
  }

  /** Scan for players in range (GUARD ONLY) */
  private scanStream(player: Player) {
    return Observable
      .timer(0, GameSettings.SCAN_INTERVAL)
      .do(() => {

        let routes = Helper.scan(this, player, this.players, 5);
        if (routes.length) {
          player.action = PlayerActions.ATTACKING;
          /** Get the closest target */
          let res = routes.reduce((prev, next) => prev.route.length > next.route.length ? next : prev);
          /** Remove the target tile from next route */
          res.route.shift();
          player.route = res.route;
          this.players$[player.routingIndex].next(res.target);
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

  /** player attack another player */
  private attackingStream() {
    return this.attacking$.exhaustMap(res => {
      /** Change attacker direction towards the victim */
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

      return Observable.of(null)
        .delay(attacker.speed)
        .do(() => {
          attacker.styles = Object.assign({}, attacker.styles, {transform: 'translate(0, 0)'});
          attacker.state = PlayerStates.IDLE;
          /** Add blood effect & remove after 1 second */
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

  private addPlayer(player: Player) {

    this.grid[player.index.x][player.index.y].walkable = false;
    this.players.push(player);
    player.routingIndex = this.players$.push(new Subject<Tile[]>()) - 1;

    this.pauser$.switchMap(paused => paused ? Observable.never() : this.moveStream(player))
      .takeUntil(this.gameOver$).subscribe();

    if (player.bot)
      this.pauser$.switchMap(paused => paused ? Observable.never() : this.pilotStream(player))
        .takeUntil(this.gameOver$).subscribe();
  }

  private removePlayer(player: Player) {
    /** Remove & Unsubscribe automatically */
    this.audio.dead();

    this.players$.remove(this.players$[player.routingIndex]);
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
      type: GameStore.UPDATE_STORE
    });
  }
}
