import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Store} from "@ngrx/store";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

import {Tile} from '../models/tile/tile.model';
import {GameState} from "../store/game.state";
import {Hero} from "../models/hero/hero.model";
import {Enemy} from "../models/enemy/enemy.model";
import {IGrid} from "./grid.interface";
import {PathFinder} from "../algorithm/pathfinder";
import {Player} from "../models/player/player.model";
import {PlayerState} from "../models/player/player.interface";

@Injectable()
export class GridService implements IGrid {

  /** Grid Tiles */
  grid: Tile[][];
  height: number;
  width: number;
  tileSize: number;
  hero: Hero;
  enemy: Enemy;

  playerSubjects: BehaviorSubject<Tile[]>[] = [];

  constructor(private store: Store<GameState>, private http: Http) {
    this.newGame(10, 10, 50);
  }

  newGame(x: number, y: number, tileSize: number) {
    this.tileSize = tileSize;
    this.loadMap(x, y);
  }

  loadMap(x: number, y: number) {

    /** Set grid size */
    this.width = x;
    this.height = y;
    this.grid = [];

    /** Draw the base */
    for (let i = 0; i < x; i++) {
      this.grid[i] = [];
      for (let j = 0; j < y; j++) {
        this.grid[i].push(new Tile({x: i, y: j}, true));
      }
    }

    /** Load the map */
    this.http.get(prefixUrl('/../../assets/map/map.json')).map(res => res.json()).subscribe(
      (res) => {
        res.map((object) => {
          let tile = new Tile(object.index, object.walkable);

          this.setTileBackgroundImage(tile, object.image);
          this.grid[object.index.x][object.index.y] = tile;
        });

        /** Create hero */
        this.hero = new Hero({x: x - 1, y: y - 1});
        this.hero.subjectIndex = this.playerSubjects.push(new BehaviorSubject<Tile[]>([])) - 1;
        this.registerPlayerRoute(this.hero);

        /** Create Enemy */
        this.enemy = new Enemy({x: 0, y: 0});
        this.enemy.subjectIndex = this.playerSubjects.push(new BehaviorSubject<Tile[]>([])) - 1;
        this.registerPlayerRoute(this.enemy);
        this.guard();

        this.setState();
      }
    );

  }

  registerPlayerRoute(player: Player) {
    /** Stream recent route tiles */
    console.log(this.playerSubjects[player.subjectIndex]);
    this.playerSubjects[player.subjectIndex].switchMap((arr) => {
      return Observable
        .interval(300)
        .take(arr.length)
        .map(i => arr.pop())
        .timeInterval()
        .do(null, null, () => {
          setTimeout(() => {
            /** Set player state to idle after he reaches the target */
            player.state = PlayerState.IDLE;
            this.setState();
          }, 300);
        });
    }).subscribe(
      (v) => {
        /** Move to the next step */
        this.moveStep(player, v.value);
      }
    );
  }

  moveHero(target: Tile) {
    this.move(this.hero, target, true);
  }

  move(player: Player, target: Tile, move?: boolean) {
    setTimeout(() => {

      let pathFinder = new PathFinder(this.grid, this.height, this.width);

      /** Make the player tile walkable so PathFinder accepts it */
      let start = this.grid[player.index.x][player.index.y];
      start.walkable = true;

      let route = pathFinder.searchPath(start, target, move);
      if (!route.length) {
        start.walkable = false;
        return;
      }
      /** Add target to the beginning of route array */
      // route.unshift(target);
      /** Start the first step to skip the first delay */
      this.moveStep(player, route.pop());
      this.playerSubjects[player.subjectIndex].next(route);
    }, 1);
  }

  moveStep(player: Player, target: Tile) {

    console.log(target.index);

    if (target.index.x === player.index.x) {
      if (target.index.y > player.index.y) {
        // console.log('Down');
        player.direction = directions.BOTTOM;
      }
      else {
        // console.log('Up');
        player.direction = directions.TOP;
      }
    }

    else {
      if (target.index.x > player.index.x) {
        // console.log('Right');
        player.direction = directions.RIGHT;
      }
      else {
        // console.log('Left');
        player.direction = directions.LEFT;
      }
    }

    /** Set the start tile to walkable (required for PathFinder) */
    this.grid[player.index.x][player.index.y].walkable = true;
    /** Set the target tile to unwalkable (required to prevent players walking on the same tile) */
    target.walkable = false;

    player.state = PlayerState.WALKING;
    player.index = target.index;
    this.setState();
  }

  guard() {
    this.takeAWalk(this.enemy);
    this.playerInRange(this.enemy, this.hero);
  }

  /** Check if player in range */
  playerInRange(guard: Player, player: Player) {
    setTimeout(() => {

      let xRange = getRange(this.width, guard.index.x);
      let yRange = getRange(this.height, guard.index.y);

      for (let i = xRange.min; i < xRange.max; i++) {
        for (let j = yRange.min; j < yRange.max; j++) {
          if (JSON.stringify(this.grid[i][j].index) === JSON.stringify(player.index)) {
            console.log("Found");
            this.move(player, guard, false);
          }
        }
      }

      this.playerInRange(guard, player);
    }, 1000);
  }

  /** Take a walk:
   * Move a player randomly 3 tiles range */
  takeAWalk(player: Player) {
    setTimeout(() => {

      let xRange = getRange(this.width, player.index.x);
      let yRange = getRange(this.height, player.index.y);
      let x = getRandomBetween(xRange.min, yRange.max);
      let y = getRandomBetween(yRange.min, yRange.max);

      let target = this.grid[x][y];
      if (target.walkable) {
        this.move(player, target, true);
      }

      this.takeAWalk(player);
    }, getRandomBetween(1000, 2500));
  }

  setState() {
    let state = {
      grid: this.grid,
      hero: this.hero,
      enemy: this.enemy
    };

    this.store.dispatch({
      payload: state, type: ''
    });
  }


  setTileBackgroundColor(tile: Tile, color: string) {
    tile.styles.backgroundColor = color;
  }

  setTileBackgroundImage(tile: Tile, src: string, position?: string) {
    tile.styles.backgroundImage = "url(" + src + ")" || "";
    tile.styles.backgroundPosition = position || "";
  }
}

const directions = {
  TOP: "walkingTop",
  LEFT: "walkingLeft",
  RIGHT: "walkingRight",
  BOTTOM: "walkingBottom"
};

const getRandomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const getRange = (maxIndex: number, index: number, range: number = 3) => {

  let minIndex = 0;

  let min = index - range;
  let max = index + range;

  return {
    min: (min < minIndex) ? minIndex : min,
    max: (max > maxIndex) ? maxIndex : max
  };
};


export const prefixUrl = (link) => {
  return "ai-game" + link;
};
