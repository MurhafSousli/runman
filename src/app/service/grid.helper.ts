import {GridService} from "./grid.service";
import {Player, Tile, PlayerDirections} from "../models";
import {PathFinder} from "../algorithm/pathfinder";

export module Helper {

  export const getRandomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  export const getRange = (maxIndex: number, currIndex: number, range: number) => {

    let minIndex = 0;
    let min = currIndex - range;
    let max = currIndex + range;
    return {
      min: (min < minIndex) ? minIndex : min,
      max: (max > maxIndex) ? maxIndex : max
    };
  };

  export const getRangeTiles = (gridService: GridService, start: Tile, range: number) => {
    let xRange = getRange(gridService.width - 1, start.index.x, range);
    let yRange = getRange(gridService.height - 1, start.index.y, range);
    let tiles = [];
    for (let i = xRange.min; i <= xRange.max; i++)
      for (let j = yRange.min; j <= yRange.max; j++)
        if (gridService.grid[i][j].walkable)
          tiles.push(gridService.grid[i][j]);
    return tiles;
  };

  export const prefixUrl = (link) => {
    return "runman" + link;
  };


  /** get random **walkable** target within range (Auto-pilot) */
  export const getRandomTarget = (gridService: GridService, player: Player, range: number): Tile => {
    let tiles = Helper.getRangeTiles(gridService, player, range);
    return tiles.filter(tile => tile.walkable)[Math.floor(Math.random() * tiles.length)];
  };

  export const getPlayerDirection = (player: Player, target: Tile) => {
    return (target.index.x === player.index.x) ?
      (target.index.y > player.index.y) ? PlayerDirections.BOTTOM : PlayerDirections.TOP
      : (target.index.x > player.index.x) ? PlayerDirections.RIGHT : PlayerDirections.LEFT;
  };

  export const scan = (gridService: GridService, guard: Player, players: Player[], range?: number) => {

    let xRange = Helper.getRange(gridService.width - 1, guard.index.x, range);
    let yRange = Helper.getRange(gridService.height - 1, guard.index.y, range);

    let routes = [];
    /** Search the range for players */
    for (let i = xRange.min; i <= xRange.max; i++)
      for (let j = yRange.min; j <= yRange.max; j++)

        /** Search for players except the guard himself */
        players.filter(player => player !== guard).map((player) => {

          if (hasSameIndex(gridService.grid[i][j], player)) {

            /** If player detected */
            let start = gridService.grid[guard.index.x][guard.index.y];
            let target = gridService.grid[player.index.x][player.index.y];
            start.walkable = true;
            target.walkable = true;
            let route = PathFinder.searchPath(gridService, start, target);
            if (route.length) {
              routes.push({route: route, target: player});
            }
            start.walkable = false;
            target.walkable = false;
          }
        });
    return routes
  };

  /** Get number of tiles can fit in view size */
  export const getTileCount = (size, tileSize) => {
    let tileCount = size / tileSize;
    let roundNum = Math.round(tileCount);
    return (tileCount < roundNum) ? roundNum - 1 : roundNum;
  };

  /** Check if two tiles has the same index */
  export const hasSameIndex = (src: Tile, target: Tile) =>{
    return JSON.stringify(src.index) === JSON.stringify(target.index);
  };
}

// export const setTileBackgroundColor = (tile: Tile, color: string) => {
//   tile.styles.backgroundColor = color;
// };

// export const setTileBackgroundImage = (tile: Tile, src: string, position?: string) => {
//   tile.styles.backgroundImage = "url(" + src + ")" || "";
//   tile.styles.backgroundPosition = position || "";
// };
