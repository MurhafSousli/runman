import {Tile} from "../models/tile/tile.model";
import {List} from "./list.class";

export class PathFinder {

  startTile: Tile;
  endTile: Tile;

  closedList: List<Tile> = new List<Tile>();
  openList: List<Tile> = new List<Tile>();

  constructor(private grid: Tile[][], private height: number, private width: number) {

    /** Remove previous highlighting */
    this.grid.map((row) => {
      row.map((tile: Tile) => {
        tile.ball = false;
      });
    });
  }

  searchPath(start: Tile, end: Tile): Tile[] {
    this.startTile = start;
    this.endTile = end;

    /** Path validation */
    if (JSON.stringify(start.index) === JSON.stringify(end.index)) {
      console.log("the start tile = the end.");
      return [];
    }

    if (!start.walkable) {
      console.log('The start tile in not walkable, choose different tile than', start.index);
      return [];
    }

    if (!end.walkable) {
      console.log('The end tile in not walkable, choose different tile than', end.index);
      return [];
    }
    /** Start A* Algorithm */

    /** Add the starting tile to the openList */
    this.openList.push(start);
    let currentTile: Tile;

    /** While openList is not empty */
    while (this.openList.length) {
      //current node = node for open list with the lowest cost.
      currentTile = this.getTileWithLowestTotal(this.openList);

      //if the currentTile is the endTile, then we can stop searching
      if (JSON.stringify(currentTile.index) === JSON.stringify(end.index)) {

        return this.shortestPath();
      }
      else {
        //move the current tile to the closed list and remove it from the open list.
        this.openList.remove(currentTile);
        this.closedList.push(currentTile);

        //Get all adjacent Tiles
        let adjacentTiles = this.getAdjacentTiles(currentTile);

        for (let adjacentTile of adjacentTiles) {
          //Get tile is not in the open list
          if (!this.openList.contains(adjacentTile)) {
            //Get tile is not in the closed list
            if (!this.closedList.contains(adjacentTile)) {
              //move it to the open list and calculate cost
              this.openList.push(adjacentTile);

              //calculate the cost
              adjacentTile.search.cost = currentTile.search.cost + 1;
              //calculate the manhattan distance
              adjacentTile.search.heuristic = this.manhattanDistance(adjacentTile);
              // calculate the total amount
              adjacentTile.search.total = adjacentTile.search.cost + adjacentTile.search.heuristic;

              // currentTile.setBackgroundColor('rgba(0, 181, 93, 0.4)');
            }
          }
        }
      }
    }
  }

  private getTileWithLowestTotal(openList: Tile[]): Tile {

    let tileWithLowestTotal = new Tile();
    let lowestTotal: number = 999999999;
    /** Search open tiles and get the tile with the lowest total cost */
    for (let openTile of openList) {
      if (openTile.search.total <= lowestTotal) {
        //clone lowestTotal
        lowestTotal = openTile.search.total;
        tileWithLowestTotal = openTile;
      }
    }
    return tileWithLowestTotal;
  }

  private getAdjacentTiles(current: Tile): Tile[] {

    let adjacentTiles: Tile[] = [];
    let adjacentTile: Tile;

    //Tile to left
    if (current.index.x - 1 >= 0) {
      adjacentTile = this.grid[current.index.x - 1][current.index.y];
      if (adjacentTile && adjacentTile.walkable) {
        adjacentTiles.push(adjacentTile);
      }
    }

    //Tile to right
    if (current.index.x + 1 < this.width) {
      adjacentTile = this.grid[current.index.x + 1][current.index.y];
      if (adjacentTile && adjacentTile.walkable) {
        adjacentTiles.push(adjacentTile);
      }
    }

    //Tile to Under
    if (current.index.y + 1 < this.height) {
      adjacentTile = this.grid[current.index.x][current.index.y + 1];
      if (adjacentTile && adjacentTile.walkable) {
        adjacentTiles.push(adjacentTile);
      }
    }

    //Tile to Above
    if (current.index.y - 1 >= 0) {
      adjacentTile = this.grid[current.index.x][current.index.y - 1];
      if (adjacentTile && adjacentTile.walkable) {
        adjacentTiles.push(adjacentTile);
      }
    }
    return adjacentTiles;
  }

  /** Calculate the manhattan distance */
  private manhattanDistance(adjacentTile: Tile): number {

    return Math.abs((this.endTile.index.x - adjacentTile.index.x) +
      (this.endTile.index.y - adjacentTile.index.y));
  }

  private shortestPath() {
    let startFound: boolean = false;
    let currentTile = this.endTile;
    let pathTiles = [];

    //includes the end tile in the path
    pathTiles.push(this.endTile);
    this.endTile.ball = true;

    while (!startFound) {
      let adjacentTiles = this.getAdjacentTiles(currentTile);

      //check to see what newest current tile.
      for (let adjacentTile of adjacentTiles) {
        //check if it is the start tile
        if (JSON.stringify(adjacentTile.index) === JSON.stringify(this.startTile.index)) {
          return pathTiles;
        }

        //It has to be inside the closedList or openList
        if (this.closedList.contains(adjacentTile) || this.openList.contains(adjacentTile)) {
          if (adjacentTile.search.cost <= currentTile.search.cost && adjacentTile.search.cost > 0) {
            //Change the current tile.
            currentTile = adjacentTile;

            //Add this adjacentTile to the path list
            pathTiles.push(adjacentTile);

            //highlight way with yellow balls
            adjacentTile.ball = true;

            break;
          }
        }
      }
    }
  }
}

