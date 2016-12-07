import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";

import "rxjs/add/operator/map";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/timeInterval";
import "rxjs/add/operator/take";

import {Tile} from '../tile/tile.model';
import {GameState} from "../store/game.reducer";
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
        this.hero = new Player({x: x - 1, y: y - 1}, true, this.tileSize, '../../assets/sprites.png', 'top center');
        // this.createHero(x - 1, y - 1);
        this.setState();
      }
    );

  }

  // createHero(x: number, y: number) {
  //   // this.hero = new Player({x: x, y: y}, true, this.tileSize, '../../assets/sprites.png', '100% 800%');
  //   this.hero = {
  //     index: {
  //       x: x,
  //       y: y
  //     },
  //     walkable: true,
  //     tileSize: this.tileSize,
  //     // image: '../../assets/sprites.png',
  //     // imagePosition: '100% 800%'
  //   };
  // }

  moveHero(target: Tile) {
    let pathFinder = new PathFinder(this.grid, this.height, this.width);
    let route = pathFinder.searchPath(this.grid[this.hero.index.x][this.hero.index.y], target);
    this.moveToTarget(route);
  }

  /**
   * Movee with an interval between steps */
  private moveToTarget(targets: Tile[]) {
    console.log(targets);
    Observable
      .interval(200)
      .timeInterval()
      .take(targets.length)
      .map(v => {
        let i = v.value;
        this.hero.index = targets[i].index;
        this.setState();
      }).subscribe();
  }

  /**
   * Movee with an interval between steps */
  private move(route: Directions[]) {

    Observable
      .interval(200)
      .timeInterval()
      .take(route.length)
      .map(v => {
        let i = v.value;
        this.moveByDirection(this.hero, route[i]);
      }).subscribe();
  }

  /** Move object by direction (TESTED)*/
  moveByDirection(tile: Tile, direction: Directions) {

    switch (direction) {
      case Directions.DOWN:
        tile.goDown();
      case Directions.UP:
        tile.goUp();
      case Directions.RIGHT:
        tile.goRight();
      case Directions.LEFT:
        tile.goLeft();
      default:
    }
    this.setState();
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

/** Direction matches arrows keys value */
enum Directions{
  LEFT,
  UP,
  RIGHT,
  DOWN
}


// /** Move tile */
// private moveToTarget(tile: Node, target: Node) {
//   /** Check if target exist and available */
//   if (target && target.isAvailable) {
//     // call the search algorithm to get the directions
//   }
// }
// moveToTarget(tile: Node, target: Node) {
//   var move = () => {
//     setTimeout(() => {
//       if (JSON.stringify(tile.index) !== JSON.stringify(target.index)) {
//
//         if (tile.index.x > target.index.x) {
//           tile.index.x -= 1;
//         }
//         else if (tile.index.x < target.index.x) {
//           tile.index.x += 1;
//         }
//         if (tile.index.y > target.index.y) {
//           tile.index.y -= 1;
//         }
//         else if (tile.index.y < target.index.y) {
//           tile.index.y += 1;
//         }
//         this.hero = tile;
//         this.setState();
//         move();
//       }
//     }, 200);
//   };
//
//   move();
//
// }


// private getTargetByDirection(tile: Node, direction): Node {
//   switch (direction) {
//     case Directions.DOWN:
//       return this.matrix[tile.index.x][tile.index.y + 1] || undefined;
//     case Directions.UP:
//       return this.matrix[tile.index.x][tile.index.y - 1] || undefined;
//     case Directions.RIGHT:
//       return this.matrix[tile.index.x + 1][tile.index.y] || undefined;
//     case Directions.LEFT:
//       return this.matrix[tile.index.x - 1][tile.index.y] || undefined;
//     default:
//       return undefined;
//   }
// }
// moveHeroByDirection(direction: Directions) {
//   this.hero = this.moveByDirection(this.hero, direction);
//   this.setState();
// }
// private moveByDirection(tile: Node, direction: Directions) {
//   return this.moveByTarget(tile, this.getTargetByDirection(tile, direction));
// }


/**
 *
 // let x, y;
 // this.matrix.map(row => {
    //   let index = row.indexOf(target);
    //   if (index !== -1) {
    //     x = index;
    //     y = this.matrix.indexOf(row);
    //     return;
    //   }
    // });
 // console.log(x, y);
 */
