import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";

import {IGrid} from "./grid.interface";
import {PathFinder} from "../algorithm/pathfinder";
import {GameState} from "../store/game.state";
import {Tile} from '../models/tile/tile.model';
import {Hero} from "../models/hero/hero.model";
import {Guard} from "../models/guard/guard.model";
import {Player} from "../models/player/player.model";
import {PlayerState, PlayerActions} from "../models/player/player.interface";

import {Helper} from "./grid.helper";
import {GameEngine} from "./grid.engine";

@Injectable()
export class GridService implements IGrid {

  /** Grid Tiles */
  grid: Tile[][];
  height: number;
  width: number;
  tileSize: number;
  hero: Hero;
  guard: Guard;
  goal: Tile;

  timer: Date;

  players$: Subject<Tile[]>[] = [];
  move$: Subject<any> = new Subject();
  // action$: Subject<any> = new Subject();
  scanner$: Observable<any> = Observable.of(null);
  takeAWalk$: Observable<any> = Observable.of(null);

  constructor(private store: Store<GameState>, private http: Http) {
    this.newGame(10, 10, 50);
  }

  newGame(x: number, y: number, tileSize: number) {

    this.tileSize = tileSize;

    /** Set grid size */
    this.width = x;
    this.height = y;
    this.grid = [];

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
          let tile = new Tile(object.index, object.walkable);

          // GameEngine.setTileBackgroundImage(tile, object.image);
          tile.sprite = object.image;
          this.grid[object.index.x][object.index.y] = tile;
        });
        /** Create goal */
        this.goal = new Tile({x: 0, y: 0}, true);
        this.goal.sprite = Helper.prefixUrl('../../assets/flag.png');

        this.startTimer(5 * 60).subscribe();

        /** Create hero */
        this.hero = new Hero({x: x - 1, y: y - 1});
        this.hero.subjectIndex = this.players$.push(new Subject<Tile[]>()) - 1;

        /** Create Enemy */
        this.guard = new Guard({x: 0, y: 0});
        this.guard.subjectIndex = this.players$.push(new Subject<Tile[]>()) - 1;

        this.activateMoves().subscribe();
        // this.activateActions().subscribe();
        this.activatePlayerMoves(this.guard).subscribe();
        this.activatePlayerMoves(this.hero).subscribe();
        this.takeAWalk(this.guard).subscribe();
        this.scanner().subscribe();

        this.setState();
      },
      (err) => console.warn(err),
      () => console.log("Map Loaded.")
    );

  }

  moveHero(target: Tile) {
    this.move$.next({start: this.hero, target: target});
  }
  attack(player: Player){
    GameEngine.attackEffect(player);
  }

  /** Activate player movement */
  private activatePlayerMoves(player: Player) {
    /** Stream recent route tiles */
    return this.players$[player.subjectIndex].switchMap((arr) => {
      return Observable
        .timer(0, player.speed)
        .take(arr.length)
        .map(i => arr[arr.length - i - 1])
        .timeInterval()
        .do(
          (next) => {
            /** Move to the next tile */
            let target = next.value;
            // target.ball = false;
            GameEngine.moveStep(this, player, target);
            let range = Helper.getRange(1,0,);

          },
          (err) => {
            console.warn(err);
          },
          () => {

            arr.map((tile: Tile) => {

              tile.ball = false;
            });
            setTimeout(() => {
              /** Set player state to idle after he reaches the target */
              player.state = PlayerState.IDLE;
              this.setState();
            }, player.speed);
          });
    });
  }

  private activateMoves() {
    return this.move$.do((res) => {
        /** Make the player tile walkable so PathFinder accepts it */
        let start = this.grid[res.start.index.x][res.start.index.y];
        start.walkable = true;

        let route = PathFinder.searchPath(this, start, res.target);

        if (!route.length) {
          start.walkable = false;
          return;
        }

        route.map((tile) => {
          tile.ball = true;
        });
        this.players$[res.start.subjectIndex].next(route);
      },
      (err) => {
        console.warn(err)
      }
    );
  }

  // private activateActions() {
  //   return this.action$.do((res) => {
  //
  //     /** Make the player tile walkable so PathFinder accepts it */
  //     let start = this.grid[res.start.index.x][res.start.index.y];
  //     start.walkable = true;
  //     let route = PathFinder.searchPath(this, start, res.target);
  //
  //     if (!route.length) {
  //       start.walkable = false;
  //       return;
  //     }
  //     /** Remove the first tile (Target tile) */
  //     route.shift();
  //     this.players$[res.start.subjectIndex].next(route);
  //
  //   });
  // }


  /** Scan for players in range */
  private scanner() {
    return this.scanner$
      .concatMap(() => Observable.timer(1000))
      .do(() => {
        let targets = GameEngine.scan(this, this.guard, [this.hero], 5);

        if (targets.length) {
          /** Get the closest target */
          let target = targets.reduce((prev, next) => prev.length > next.length ? next : prev);
          /** Remove the first tile (Target tile) */
          target.shift();
          this.guard.action = PlayerActions.ATTACKING;
          this.players$[this.guard.subjectIndex].next(target);
        }
        else {
          /** If not target is close take a walk */
          this.guard.action = PlayerActions.GUARDING;
        }
      })
      .repeat();
  }

  /** Take a walk:
   * Move a player randomly 3 tiles range */
  private takeAWalk(player: Player) {
    return this.takeAWalk$
      .concatMap(() => Observable.timer(Helper.getRandomBetween(1000, 2500)))
      .do(() => {
        if (player.action === PlayerActions.ATTACKING) return;
        let target = GameEngine.getRandomTarget(this, player);
        if (target.walkable) {
          this.move$.next({start: player, target: target});
        }
      })
      .repeat();
  }

  private startTimer(duration: number) {
    return Observable
      .interval(1000)
      .timeInterval()
      .do((x) => {
        let timer = duration - x.value;
        var t = new Date(1970, 0, 1);
        t.setSeconds(timer);
        if (timer < 0) {
          /** Game over */
          alert("Game Over");
          return;
        }
        this.timer = t;
        this.setState();
      })
      .share();
  }

  setState() {
    let state = {
      grid: this.grid,
      hero: this.hero,
      guard: this.guard,
      score: 5000,
      time: this.timer
    };
    this.store.dispatch({
      payload: state, type: ''
    });
  }
}
