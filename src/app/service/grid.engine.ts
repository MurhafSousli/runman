import {Tile} from "../models/tile/tile.model";
import {Player} from "../models/player/player.model";
import {PlayerActions, PlayerDirections, PlayerState} from "../models/player/player.interface";
import {PathFinder} from "../algorithm/pathfinder";
import {Helper} from "./grid.helper";
import {GridService} from "./grid.service";

export module GameEngine {

  export const setTileBackgroundColor = (tile: Tile, color: string) => {
    tile.styles.backgroundColor = color;
  };

  export const setTileBackgroundImage = (tile: Tile, src: string, position?: string) => {
    tile.styles.backgroundImage = "url(" + src + ")" || "";
    tile.styles.backgroundPosition = position || "";
  };

  export const attackEffect = (player: Player) => {

      switch (player.direction){
        case PlayerDirections.BOTTOM:
          player.styles.margin = "30px 0 0 0";
          break;
        case PlayerDirections.LEFT:
          player.styles.margin = "0 0 0 -30px";
          break;
        case PlayerDirections.RIGHT:
          player.styles.margin = "0 30px 0";
          break;
        case PlayerDirections.TOP:
          player.styles.margin = "-30px 0 0 0 ";
          break;
        default:
          player.styles.margin = "0";
      }
    setTimeout(()=>{
      player.styles.margin = "0";
    }, 150);

  };

  export const scan = (gridService: GridService, guard: Player, players: Player[], range?: number) => {
    let xRange = Helper.getRange(gridService.width, guard.index.x, range);
    let yRange = Helper.getRange(gridService.height, guard.index.y, range);

    let routes = [];

    for (let i = xRange.min; i < xRange.max; i++)
      for (let j = yRange.min; j < yRange.max; j++)
        /** Search for players */
        players.map((player) => {
          if (JSON.stringify(gridService.grid[i][j].index) === JSON.stringify(player.index)) {

            /** If player detected */
            let start = gridService.grid[guard.index.x][guard.index.y];
            let target = gridService.grid[player.index.x][player.index.y];
            start.walkable = true;
            target.walkable = true;
            let route = PathFinder.searchPath(gridService, start, target);
            routes.push(route);
            start.walkable = false;
            target.walkable = false;
          }
        });

    return routes
  };

  /** Generate target within range to move to (take a walk) */
  export const getRandomTarget = (gridService: GridService, player: Player, range: number): Tile => {

    let xRange = Helper.getRange(gridService.width, player.index.x, range);
    let yRange = Helper.getRange(gridService.height, player.index.y, range);
    let x = Helper.getRandomBetween(xRange.min, yRange.max);
    let y = Helper.getRandomBetween(yRange.min, yRange.max);

    return gridService.grid[x][y];
  };

  export const moveStep = (gridService: GridService, player: Player, target: Tile) => {

    if (target.index.x === player.index.x) {
      if (target.index.y > player.index.y) player.direction = PlayerDirections.BOTTOM;
      else player.direction = PlayerDirections.TOP;
    }

    else {
      if (target.index.x > player.index.x) player.direction = PlayerDirections.RIGHT;
      else player.direction = PlayerDirections.LEFT;
    }

    /** Set the player current tile to walkable */
    gridService.grid[player.index.x][player.index.y].walkable = true;

    player.state = PlayerState.WALKING;
    player.index = target.index;
    /** Set the player future tile to un-walkable */
    target.walkable = false;
    gridService.setState();
  };

}
