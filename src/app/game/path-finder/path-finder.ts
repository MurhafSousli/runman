import { Observable, of, Subject, Subscriber, throwError } from 'rxjs';
import { delay, expand, finalize, map, switchMap, takeUntil, takeWhile } from 'rxjs/operators';
import { Tile, TileNode } from '../classes';
import { GameState, Index } from '../models';
import { compareIndex } from '../../map/map';
import { Grid } from './grid';
import { Heuristic } from './hueristic';

interface PathFinderState {
  start?: TileNode;
  end?: TileNode;
  openList?: TileNode[];
  closedList?: TileNode[];
  pathList?: TileNode[];
  currentTile?: TileNode;
  pathFound?: boolean;
  pathConstructed?: boolean;
  debugStartTime?: number;
  destroyed?: Subject<void>;
}

export class PathFinder {
  // Keeps track of the ongoing searches so they can be handled in case of duplication.
  // Each search call gets a destroyer stream which gets deleted immediately after it completes.
  // Purpose: If user called a scroll function again on the same element before the scrolls completes,
  // it cancels the ongoing scroll and starts a new one
  private readonly _onGoingSearches = new Map<string, Subject<void>>();
  private readonly _grid: Grid;

  constructor(grid: Tile[][], private updateState: (state: GameState) => void) {
    this._grid = new Grid(grid);
  }

  /**
   * Initializes a destroyer stream, re-initializes it if the element is already being scrolled
   */
  private _initSearch(start: Index, end: Index): Subject<void> {
    const key = `${start.x}${start.y}-${end.x}${end.y}`;
    if (this._onGoingSearches.has(key)) {
      this._onGoingSearches.get(key).next();
    }
    return this._onGoingSearches.set(key, new Subject<void>()).get(key);
  }

  /**
   * Deletes the destroyer function, runs if the search has finished or interrupted
   */
  private _destroy(start: Index, end: Index, destroyed: Subject<void>): void {
    console.log('Destroyed!');
    const key = `${start.x}${start.y}-${end.x}${end.y}`;
    destroyed.complete();
    this._onGoingSearches.delete(key);
  }

  findPath(start: TileNode, end: TileNode): Observable<TileNode[]> {
    // Validate params
    if (!this._grid) {
      return throwError('You can\'t set a path without first calling setGrid() on EasyStar.');
    }
    // Start or endpoint outside of scope.
    if (start.index.x < 0 || start.index.y < 0 || end.index.x < 0 || end.index.y < 0 ||
      start.index.x >= this._grid.rows || start.index.y >= this._grid.cols ||
      end.index.x >= this._grid.rows || end.index.y >= this._grid.cols) {
      return throwError('Your start or end point is outside the scope of your grid.');
    }
    if (compareIndex(start.index, end.index)) {
      return throwError('the start tile = the end.');
    }
    if (!start.walkable) {
      return throwError(`The start tile in not walkable, choose different tile than ${start.index}`);
    }
    if (!end.walkable) {
      return throwError(`The end tile in not walkable, choose different tile than ${end.index}`);
    }

    // Reset numbers
    // this._grid.grid.forEach(row => row.forEach(tile => {
    //   tile.search = {
    //     inPathList: false,
    //     inClosedList: false,
    //     f: 0,
    //     g: 0,
    //     h: 0
    //   };
    // }));
    // this.updateState({});

    // Initialize a destroyer stream, reinitialize it if the element is already being scrolled
    const destroyed: Subject<void> = this._initSearch(start.index, end.index);

    // Start A* Algorithm
    const openList = [];
    const closedList = [];

    // Add the starting tile to the this.openList
    start.search.inOpenList = true;
    openList.push(start);
    this.updateState({});

    const context = {
      openList,
      closedList,
      start,
      end,
      destroyed
    };

    return new Observable<PathFinderState>((subscriber: Subscriber<PathFinderState>) => {
      of(null).pipe(
        expand(() => this._search(context).pipe(
          takeWhile((currContext: PathFinderState) => {
            if (currContext.pathFound) {
              subscriber.next(currContext);
              subscriber.complete();
              return false;
            }
            return true;
          })
        )),
        takeUntil(destroyed),
      ).subscribe();
    }).pipe(
      switchMap((currContext: PathFinderState) => this._reconstructPath(currContext)),
      map((currContext: PathFinderState) => currContext.pathList),
      finalize(() => this._destroy(start.index, end.index, destroyed))
    );
  }

  /**
   * Search
   */
  private _search(state: PathFinderState): Observable<PathFinderState> {
    const currentTile = this.getTileWithLowestTotal(state.openList);
    // End case -- result has been found, return the traced path
    if (compareIndex(currentTile.index, state.end.index)) {
      state.pathFound = true;
      state.openList = [];
      return of(state).pipe(delay(100));
    } else {
      // Normal case -- move currentNode from open to closed, process each of its neighbors
      currentTile.search.inOpenList = false;
      currentTile.search.inClosedList = true;
      remove(state.openList, currentTile);
      state.closedList.push(currentTile);
      this.updateState({});

      // Get all adjacent Tiles
      this.getNeighbors(currentTile)
        // Get tile is not in the open list
        .filter((neighbor: TileNode) => !state.openList.includes(neighbor))
        // Get tile is not in the closed list
        .filter((neighbor: TileNode) => !state.closedList.includes(neighbor))
        // move it to the open list and calculate cost
        .map((neighbor: TileNode) => {
          // Set the g
          neighbor.search.g = currentTile.search.g + 1;
          // Set the Heuristic function
          neighbor.search.h = Heuristic.manhattan({
            dx: Math.abs(state.end.index.x - neighbor.index.x),
            dy: Math.abs(state.end.index.y - neighbor.index.y)
          });
          neighbor.search.f = neighbor.search.g + neighbor.search.h;
          // For debug
          neighbor.search.inOpenList = true;
          state.openList.push(neighbor);
        });
      return of(state).pipe(delay(100));
    }
  }

  /**
   * Reconstruct Path
   */
  private _reconstructPath(state: PathFinderState): Observable<PathFinderState> {
    // Walk throw path from the end to the start
    console.log('[GET ShortestPath]', state);
    state.currentTile = state.end;
    // Includes the end tile in the path
    state.pathList = [state.end];

    return new Observable<PathFinderState>((subscriber: Subscriber<PathFinderState>) => {
      of(null).pipe(
        expand(() => this._construct(state).pipe(
          takeWhile((currContext: PathFinderState) => {
            if (currContext.pathConstructed) {
              currContext.destroyed.next();
              subscriber.next(currContext);
              subscriber.complete();
              return false;
            }
            return true;
          })
        )),
        takeUntil(state.destroyed),
      ).subscribe();
    });
  }

  /**
   * Construct
   */
  private _construct(state: PathFinderState): Observable<PathFinderState> {
    console.log('[construct]: ', state.currentTile.index);
    // Check to see what newest current tile
    for (const neighbor of this.getNeighbors(state.currentTile)) {
      // Check if it is the start tile
      if (compareIndex(neighbor.index, state.start.index)) {
        state.pathConstructed = true;
        return of<PathFinderState>(state);
      }
      // It has to be inside the closedList or openList
      if (state.closedList.includes(neighbor) || state.openList.includes(neighbor)) {
        if (neighbor.search.g <= state.currentTile.search.g && neighbor.search.g > 0) {
          // Change the current tile
          neighbor.search.inPathList = true;
          state.currentTile = neighbor;
          // Add this neighbor to the path list
          state.pathList.push(neighbor);
          break;
        }
      }
    }
    return of<PathFinderState>(state);
  }

  /**
   * Get neighbors
   */
  private getNeighbors(current: TileNode): TileNode[] {
    const directions = {
      left: { x: current.index.x - 1, y: current.index.y },
      right: { x: current.index.x + 1, y: current.index.y },
      top: { x: current.index.x, y: current.index.y - 1 },
      bottom: { x: current.index.x, y: current.index.y + 1 },
    };
    return Object.values(directions)
      .map((direction: Index) => this._grid.getTile(direction))
      .filter((tile: TileNode) => tile && tile.walkable);
  }

  private getTileWithLowestTotal(openList: TileNode[]): TileNode {
    return openList.reduce((prev: TileNode, next: TileNode) => next.search.f < prev.search.f ? next : prev);
  }
}

function remove(arr: TileNode[], item: TileNode) {
  const index = arr.indexOf(item);
  if (index !== -1) {
    return arr.splice(index, 1);
  }
}
