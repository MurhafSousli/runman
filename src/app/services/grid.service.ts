import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";

import "rxjs/add/operator/map";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/timeInterval";
import "rxjs/add/operator/take";

import {Node} from '../models/node.model';
import {GameState} from "../store/game.state";
import {Player} from "../models/player.model";
import {Dijkstra} from "../algorithm/algorithm";

@Injectable()
export class GridService {

  /** Grid Nodes */
  matrix: Node[][];
  height: number;
  width: number;
  nodeSize: number;
  hero: Node;

  constructor(private store: Store<GameState>, private http: Http) {
  }

  new(x: number, y: number, nodeSize: number) {
    this.nodeSize = nodeSize;
    this.drawMap(x, y);
    this.createHero(x - 1, y - 1);
  }

  drawMap(x: number, y: number) {

    /** Set grid size */
    this.width = this.nodeSize * x;
    this.height = this.nodeSize * y;

    this.matrix = [];
    /** Draw the base */
    for (let i = 0; i < x; i++) {
      this.matrix[i] = [];
      for (let j = 0; j < y; j++) {
        this.matrix[i].push(new Node({x: i, y: j}, true));
      }
    }
    /** Draw the map */
    this.http.get('../../assets/map/map.json').map(res => res.json()).subscribe(
      (res: Node[]) => {
        res.map((object) => {
          this.matrix[object.index.x][object.index.y] = new Node(object.index, object.isAvailable, object.image);
        });
        this.setState();
      }
    );
  }

  createHero(x: number, y: number) {
    this.hero = new Player({x: x, y: y}, true, 'url(../../assets/sprites.png) 0 0 /100% 800%');
    this.setState();
  }

  moveHero(target: Node) {
    // let route = [Directions.UP, Directions.LEFT, Directions.LEFT, Directions.UP, Directions.RIGHT];
    // this.move(route);
    this.air();
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
  moveByDirection(node: Node, direction: Directions) {

    switch (direction) {
      case Directions.DOWN:
        node.index.y += 1;
      case Directions.UP:
        node.index.y -= 1;
      case Directions.RIGHT:
        node.index.x += 1;
      case Directions.LEFT:
        node.index.x -= 1;
      default:
    }
    this.setState();
  }

  private air() {

    const graph = new Dijkstra();

    this.matrix.map((row) => {
      row.map((node: Node) => {
        let x = node.index.x;
        let y = node.index.y;
        graph.addVertex(x + ":" + y, {x: x, y: y});
        console.log(x + ":" + y, {x: x, y: y});
      });
    });

    console.log(graph.shortestPath('0:0', '5:5'));
  }

  private setState() {
    let state = {
      matrix: this.matrix,
      hero: Object.assign({}, this.hero)
    };

    this.store.dispatch({
      payload: state, type: ''
    });
  }
}


/** Direction matches arrows keys value */
enum Directions{
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40
}


// /** Move node */
// private moveToTarget(node: Node, target: Node) {
//   /** Check if target exist and available */
//   if (target && target.isAvailable) {
//     // call the search algorithm to get the directions
//   }
// }
// moveToTarget(node: Node, target: Node) {
//   var move = () => {
//     setTimeout(() => {
//       if (JSON.stringify(node.index) !== JSON.stringify(target.index)) {
//
//         if (node.index.x > target.index.x) {
//           node.index.x -= 1;
//         }
//         else if (node.index.x < target.index.x) {
//           node.index.x += 1;
//         }
//         if (node.index.y > target.index.y) {
//           node.index.y -= 1;
//         }
//         else if (node.index.y < target.index.y) {
//           node.index.y += 1;
//         }
//         this.hero = node;
//         this.setState();
//         move();
//       }
//     }, 200);
//   };
//
//   move();
//
// }


// private getTargetByDirection(node: Node, direction): Node {
//   switch (direction) {
//     case Directions.DOWN:
//       return this.matrix[node.index.x][node.index.y + 1] || undefined;
//     case Directions.UP:
//       return this.matrix[node.index.x][node.index.y - 1] || undefined;
//     case Directions.RIGHT:
//       return this.matrix[node.index.x + 1][node.index.y] || undefined;
//     case Directions.LEFT:
//       return this.matrix[node.index.x - 1][node.index.y] || undefined;
//     default:
//       return undefined;
//   }
// }
// moveHeroByDirection(direction: Directions) {
//   this.hero = this.moveByDirection(this.hero, direction);
//   this.setState();
// }
// private moveByDirection(node: Node, direction: Directions) {
//   return this.moveByTarget(node, this.getTargetByDirection(node, direction));
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
