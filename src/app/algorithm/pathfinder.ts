import {Tile} from "../models";
import {List} from "./list.class";
import {GridService} from "../service/grid.service";

export module PathFinder {

  export function searchPath(gridService: GridService, start: Tile, end: Tile): Tile[] {

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
    let openList = new List<Tile>();
    let closedList = new List<Tile>();

    /** Add the starting tile to the openList */
    openList.push(start);
    let currentTile: Tile;

    /** While openList is not empty */
    while (openList.length) {
      //current node = node for open list with the lowest cost.
      currentTile = getTileWithLowestTotal(openList);

      //if the currentTile is the endTile, then we can stop searching
      if (JSON.stringify(currentTile.index) === JSON.stringify(end.index)) {
        return shortestPath(gridService, start, end, openList, closedList);
      }
      else {
        //move the current tile to the closed list and remove it from the open list.
        openList.remove(currentTile);
        closedList.push(currentTile);

        //Get all adjacent Tiles
        let adjacentTiles = getAdjacentTiles(gridService, currentTile);

        for (let adjacentTile of adjacentTiles) {
          //Get tile is not in the open list
          if (!openList.contains(adjacentTile)) {
            //Get tile is not in the closed list
            if (!closedList.contains(adjacentTile)) {
              //move it to the open list and calculate cost
              openList.push(adjacentTile);

              //calculate the cost
              adjacentTile.search.cost = currentTile.search.cost + 1;
              //calculate the manhattan distance
              adjacentTile.search.heuristic = manhattanDistance(adjacentTile, end);
              // calculate the total amount
              adjacentTile.search.total = adjacentTile.search.cost + adjacentTile.search.heuristic;

            }
          }
        }
      }
    }
  };

  const getTileWithLowestTotal = (openList: Tile[]): Tile => {

    let tileWithLowestTotal = new Tile();
    let lowestTotal: number = 999999999;
    /** Search open tiles and get the tile with the lowest total cost */
    for (let openTile of openList) {
      if (openTile.search.total <= lowestTotal) {

        lowestTotal = openTile.search.total;
        tileWithLowestTotal = openTile;
      }
    }
    return tileWithLowestTotal;
  };

  const getAdjacentTiles = (gridService: GridService, current: Tile): Tile[] => {
    let adjacentTiles: Tile[] = [];
    let adjacentTile: Tile;

    //Tile to left
    if (current.index.x - 1 >= 0) {
      adjacentTile = gridService.grid[current.index.x - 1][current.index.y];
      if (adjacentTile && adjacentTile.walkable) {
        adjacentTiles.push(adjacentTile);
      }
    }

    //Tile to right
    if (current.index.x + 1 < gridService.width) {
      adjacentTile = gridService.grid[current.index.x + 1][current.index.y];
      if (adjacentTile && adjacentTile.walkable) {
        adjacentTiles.push(adjacentTile);
      }
    }

    //Tile to Under
    if (current.index.y + 1 < gridService.height) {
      adjacentTile = gridService.grid[current.index.x][current.index.y + 1];
      if (adjacentTile && adjacentTile.walkable) {
        adjacentTiles.push(adjacentTile);
      }
    }

    //Tile to Above
    if (current.index.y - 1 >= 0) {
      adjacentTile = gridService.grid[current.index.x][current.index.y - 1];
      if (adjacentTile && adjacentTile.walkable) {
        adjacentTiles.push(adjacentTile);
      }
    }
    return adjacentTiles;
  };

  /** Calculate the manhattan distance */
  const manhattanDistance = (adjacentTile: Tile, endTile: Tile): number => {

    return Math.abs((endTile.index.x - adjacentTile.index.x) +
      (endTile.index.y - adjacentTile.index.y));
  };

  const shortestPath = (gridService: GridService, startTile: Tile, endTile: Tile, openList: List<Tile>, closedList: List<Tile>) => {
    let startFound: boolean = false;
    let currentTile = endTile;
    let pathTiles = [];

    //includes the end tile in the path
    pathTiles.push(endTile);

    while (!startFound) {
      let adjacentTiles = getAdjacentTiles(gridService, currentTile);
      //check to see what newest current tile.
      for (let adjacentTile of adjacentTiles) {
        //check if it is the start tile
        if (JSON.stringify(adjacentTile.index) === JSON.stringify(startTile.index)) {
          return pathTiles;
        }

        //It has to be inside the closedList or openList
        if (closedList.contains(adjacentTile) || openList.contains(adjacentTile)) {
          if (adjacentTile.search.cost <= currentTile.search.cost && adjacentTile.search.cost > 0) {
            //Change the current tile.
            currentTile = adjacentTile;
            //Add this adjacentTile to the path list
            pathTiles.push(adjacentTile);
            break;
          }
        }
      }
    }
  }
}

