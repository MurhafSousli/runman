import {Tile} from "../tile/tile.model";
import {List} from "./list.class";

export class PathFinder {

  grid: Tile[][];
  gridHeight: number;
  gridWidth: number;
  startTile: Tile;
  endTile: Tile;

  /** Array of the already checked tiles. */
  closedList: List<Tile> = new List<Tile>();
  openList: List<Tile> = new List<Tile>();

  constructor(grid: Tile[][], gridHeight: number, gridWidth: number) {
    /** Use a copy of the grid, but not the grid it self. */
    this.grid = grid;
    this.gridHeight = gridHeight;
    this.gridWidth = gridWidth;
  }

  searchPath(start: Tile, end: Tile): Tile[] {
    this.startTile = start;
    this.endTile = end;

    /** Path validation */
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
    let currentTile;

    /** While openList is not empty */
    while (this.openList.length) {
      //current node = node for open list with the lowest cost.
      currentTile = this.getTileWithLowestTotal(this.openList);

      //if the currentTile is the endTile, then we can stop searching
      if(JSON.stringify(currentTile.index) === JSON.stringify(end.index)){

        this.startTile.setBackgroundColor("rgba(255, 45, 45, .8)");
        this.endTile.setBackgroundColor("rgba(255, 45, 45, .8)");
        return this.shortestPath();
      }
      else {
        //move the current tile to the closed list and remove it from the open list.
        this.openList.remove(currentTile);
        this.closedList.push(currentTile);

        // //Get all adjacent Tiles
        let adjacentTiles = this.getAdjacentTiles(currentTile);

        for (let adjacentTile of adjacentTiles) {
          //Get tile is not in the open list
          if (!this.openList.contains(adjacentTile)) {
            //Get tile is not in the closed list
            if (!this.closedList.contains(adjacentTile)) {
              //move it to the open list and calculate cost
              this.openList.push(adjacentTile);

              //calculate the cost
              adjacentTile.cost = currentTile.cost + 1;

              //calculate the manhattan distance
              adjacentTile.heuristic = this.manhattanDistance(adjacentTile);

              // calculate the total amount
              adjacentTile.total = adjacentTile.cost + adjacentTile.heuristic;

              currentTile.setBackgroundColor('rgba(0, 181, 93, 0.8)');
            }
          }
        }
      }
    }
  }

  getTileWithLowestTotal(openList: Tile[]): Tile {
    let tileWithLowestTotal = new Tile();
    let lowestTotal: number = 999999999;
    /** Search open tiles and get the tile with the lowest total cost */
    for (let openTile of openList) {
      if (openTile.total <= lowestTotal) {
        //clone lowestTotal
        lowestTotal = openTile.total;
        tileWithLowestTotal = openTile;
      }
    }
    return tileWithLowestTotal;
  }

  getAdjacentTiles(current: Tile): Tile[] {
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
    if (current.index.x + 1 < this.gridWidth) {
      adjacentTile = this.grid[current.index.x + 1][current.index.y];
      if (adjacentTile && adjacentTile.walkable) {
        adjacentTiles.push(adjacentTile);
      }
    }

    //Tile to Under
    if (current.index.y + 1 < this.gridHeight) {
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
    /** TODO: Diagonal moves  */
    return adjacentTiles;
  }

  /** Calculate the manhattan distance */
  manhattanDistance(adjacentTile: Tile): number {
    return Math.abs((this.endTile.index.x - adjacentTile.index.x) +
      (this.endTile.index.y - adjacentTile.index.y));
  }

  shortestPath() {
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
        if (JSON.stringify(adjacentTile.index) === JSON.stringify(this.startTile.index)){
          return pathTiles;
        }

        //it has to be inside the closedList or openList
        if (this.closedList.contains(adjacentTile) || this.openList.contains(adjacentTile)) {
          if (adjacentTile.cost <= currentTile.cost && adjacentTile.cost > 0) {
            //change the current tile.
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

