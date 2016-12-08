import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";

import "rxjs/add/operator/map";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/timeInterval";
import "rxjs/add/operator/take";

import {Tile} from '../tile/tile.model';
import {GameState} from "../store/game.state";
import {Player} from "../player/player.model";
import {PathFinder} from "../algorithm/pathfinder";

@Injectable()
export class GridService {

  /** Grid Tiles */
  grid: Tile[][];
  height: number;
  width: number;
  tileSize: number;
  hero: Player;

  constructor(private store: Store<GameState>, private http: Http) {
    this.new(10, 10, 50);
  }

  new(x: number, y: number, tileSize: number) {
    this.tileSize = tileSize;
    this.drawMap(x, y);
  }

  drawMap(x: number, y: number) {

    /** Set grid size */
    this.width = x;
    this.height = y;
    this.grid = [];

    /** Draw the base */
    for (let i = 0; i < x; i++) {
      this.grid[i] = [];
      for (let j = 0; j < y; j++) {
        this.grid[i].push(new Tile({x: i, y: j}, true, this.tileSize));
      }
    }

    /** Draw the map */
    this.http.get('../../assets/map/map.json').map(res => res.json()).subscribe(
      (res) => {
        res.map((object) => {
          let tile = new Tile(object.index, object.walkable, this.tileSize, object.image, object.position);
          this.grid[object.index.x][object.index.y] = tile;
        });

        /** Draw the hero */
        // this.hero = new Player({x: x - 1, y: y - 1}, true, this.tileSize, '../../assets/sprites.png', 'top center');
        this.hero = new Player({x: 5, y: 5}, true, this.tileSize, '../../assets/sprites.png', 'top center');
        this.setState();
      }
    );

  }

  moveHero(target: Tile) {
    let pathFinder = new PathFinder(this.grid, this.height, this.width);
    let route = pathFinder.searchPath(this.grid[this.hero.index.x][this.hero.index.y], target);
    this.moveToTarget(route);
  }


  /** Movee with an interval between steps */
  private moveToTarget(route: Tile[]) {
    if(!route.length) return;
    // reverse the path
    route = route.reverse();
    // start the first step skip the delay
    this.hero.index = route[0].index;

    Observable
      .interval(200)
      .timeInterval()
      .take(route.length - 1)
      .map(v => {
        let i = v.value + 1;
        this.hero.index = route[i].index;
        this.setState();
      }).subscribe();
  }

  private setState() {
    let state = {
      grid: this.grid,
      hero: this.hero
    };

    this.store.dispatch({
      payload: state, type: ''
    });
  }
}
