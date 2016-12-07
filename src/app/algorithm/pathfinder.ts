import {Tile} from "../tile/tile.model";

export class PathFinder {

  grid: Tile[][];
  gridHeight: number;
  gridWidth: number;
  startTile: Tile;
  endTile: Tile;

  /** Array of the already checked tiles. */
  closedList: Tile[] = [];
  openList: Tile[] = [];

  constructor(grid: Tile[][], gridHeight: number, gridWidth: number) {
    this.grid = grid;
    this.gridHeight = gridHeight;
    this.gridWidth = gridWidth;
  }

  searchPath(start: Tile, end: Tile): Tile[] {
    this.startTile = start;
    this.endTile = end;

    /** Path validation */
    if (!this.grid[start.index.x][start.index.y].walkable) {
      console.log('The start tile in not walkable, choose different tile than', start.index.x, start.index.y);
      return;
    }
    if (!this.grid[end.index.x][end.index.y].walkable) {
      console.log('The end tile in not walkable, choose different tile than', start.index.x, start.index.y);
      return;
    }

    /** A* Algorithm
     * Add the starting tile to the openList */
    this.openList.push(start);
    //currentTile need constructor
    let currentTile = new Tile();

    /** While openList is not empty */
    while (this.openList.length) {
      //current node = node for open list with the lowest cost.
      currentTile = this.getTileWithLowestTotal(this.openList);

      //if the currentTile is the endTile, then we can stop searching
      if (currentTile.index.x === end.index.x &&
        currentTile.index.y === end.index.y) {
        console.log("YEAH, We found the end tile!!!");
        return this.openList;
      }
      else {
        //move the current tile to the closed list and remove it from the open list.
        this.removeItemFromArr(this.openList, currentTile);
        this.closedList.push(currentTile);

        // //Get all adjacent Tiles
        let adjacentTiles = this.getAdjacentTiles(currentTile);

        for (let adjacentTile of adjacentTiles) {
          //Get tile ca not be in the open list
          if (this.openList.indexOf(adjacentTile) === -1) {
            console.log("qqq");
            //Get tile ca not be in the closed list
            if (this.closedList.indexOf(adjacentTile) === -1) {
              console.log("hhh");
              //move it to the open list and calculate cost
              this.openList.push(adjacentTile);

              let tile = this.grid[adjacentTile.index.x][adjacentTile.index.y];
              //calculate the cost
              tile.cost = this.grid[currentTile.index.x][currentTile.index.y].cost + 1;
              // calculate the total amount
              tile.total = tile.cost;
              this.grid[currentTile.index.x][currentTile.index.y].setBackgroundColor('green');
            }
          }
        }
      }
    }

    this.grid[this.startTile.index.x][this.startTile.index.y].setBackgroundColor("red");
    this.grid[this.endTile.index.x][this.endTile.index.y].setBackgroundColor("red");
  }

  removeItemFromArr(arr, item) {
    let index = arr.indexOf(item);
    if (index > -1) arr.splice(index, 1);
  }

  getTileWithLowestTotal(openList: Tile[]): Tile {
    let tileWithLowestTotal = new Tile();
    let lowestTotal: number = 999999999;
    /** Search open tiles and get the tile with the lowest total cost */
    for (let openTile of openList) {
      if (this.grid[openTile.index.x][openTile.index.y].total <= lowestTotal) {
        //clone lowestTotal
        lowestTotal = this.grid[openTile.index.x][openTile.index.y].total;
        tileWithLowestTotal = this.grid[openTile.index.x][openTile.index.y];
      }
    }
    return tileWithLowestTotal;
  }

  getAdjacentTiles(current: Tile): Tile[] {
    let adjacentTiles: Tile[] = [];
    let adjacentTile;
    //Tile to Above
    if (current.index.y - 1 >= 0) {
      adjacentTile = this.grid[current.index.x][current.index.y - 1];
      if (adjacentTile && this.grid[adjacentTile.index.x][adjacentTile.index.y].walkable) {
        adjacentTiles.push(adjacentTile);
      }
    }
    //Tile to Under
    if (current.index.y + 1 < this.gridHeight) {
      adjacentTile = this.grid[current.index.x][current.index.y + 1];
      if (adjacentTile && this.grid[adjacentTile.index.x][adjacentTile.index.y].walkable) {
        adjacentTiles.push(adjacentTile);
      }
    }
    //Tile to left
    if (current.index.x - 1 >= 0) {
      adjacentTile = this.grid[current.index.x - 1][current.index.y];
      if (adjacentTile && this.grid[adjacentTile.index.x][adjacentTile.index.y].walkable) {
        adjacentTiles.push(adjacentTile);
      }
    }
    //Tile to right
    if (current.index.x + 1 < this.gridWidth) {
      adjacentTile = this.grid[current.index.x + 1][current.index.y];
      if (adjacentTile && this.grid[adjacentTile.index.x][adjacentTile.index.y].walkable) {
        adjacentTiles.push(adjacentTile);
      }
    }
    /** TODO: Daingol moves  */

    return adjacentTiles;
  }
}

