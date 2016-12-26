// typescript-astar
// http://github.com/tsugehara/typescript-astar
export module astar {
  //================== start graph js
  /*
   graph.js http://github.com/bgrins/javascript-astar
   MIT License
   Creates a Graph class used in the astar search algorithm.
   Includes Binary Heap (with modifications) from Marijn Haverbeke
   URL: http://eloquentjavascript.net/appendix2.html
   License: http://creativecommons.org/licenses/by/3.0/
   */

  export interface Position {
    x: number;
    y: number;
  }

  export enum GraphNodeType {
    WALL,
    OPEN
  }

  export class Graph {
    nodes:GraphNode[][];
    elements:number[][];

    constructor(grid:number[][]) {
      this.elements = grid;
      var nodes:GraphNode[][] = [];
      var row:number[], rowLength:number, len = grid.length;
      for (var x = 0; x < len; ++x) {
        row = grid[x];
        rowLength = row.length;
        nodes[x] = new Array(rowLength); // optimum array with size
        for (var y = 0; y < rowLength; ++y) {
          nodes[x][y] = new GraphNode(x, y, row[y]);
        }
      }
      this.nodes = nodes;
    }

    toString():string {
      var graphString = "\n";
      var nodes = this.nodes;
      var rowDebug:string, row:GraphNode[], y:number, l:number;
      for (var x = 0, len = nodes.length; x < len;) {
        rowDebug = "";
        row = nodes[x++];
        for (y = 0, l = row.length; y < l;) {
          rowDebug += row[y++].type + " ";
        }
        graphString = graphString + rowDebug + "\n";
      }
      return graphString;
    }
  }

  export class GraphNode {
    x:number;
    y:number;
    type:GraphNodeType;
    data:any;
    pos:Position;

    constructor(x:number, y:number, type:GraphNodeType) {
      this.data = {}
      this.x = x;
      this.y = y;
      this.pos = {x:x, y:y}
      this.type = type;
    }

    toString():string {
      return "[" + this.x + " " + this.y + "]";
    }

    isWall() {
      return this.type == GraphNodeType.WALL;
    }
  }

  export class BinaryHeap {
    content:any[];
    scoreFunction:(node:any) => number;

    constructor(scoreFunction:(node:any) => number) {
      this.content = [];
      this.scoreFunction = scoreFunction;
    }

    push(node:any) {
      // Add the new tile to the end of the array.
      this.content.push(node);
      // Allow it to sink down.
      this.sinkDown(this.content.length - 1);
    }

    pop() {
      // Store the first tile so we can return it later.
      var result = this.content[0];
      // Get the tile at the end of the array.
      var end = this.content.pop();
      // If there are any elements left, put the end tile at the
      // start, and let it bubble up.
      if (this.content.length > 0) {
        this.content[0] = end;
        this.bubbleUp(0);
      }
      return result;
    }

    remove(node:any) {
      var i = this.content.indexOf(node);

      // When it is found, the process seen in 'pop' is repeated
      // to fill up the hole.
      var end = this.content.pop();
      if (i !== this.content.length - 1) {
        this.content[i] = end;
        if (this.scoreFunction(end) < this.scoreFunction(node))
          this.sinkDown(i);
        else
          this.bubbleUp(i);
      }
    }

    size() {
      return this.content.length;
    }

    rescoreElement(node:any) {
      this.sinkDown(this.content.indexOf(node));
    }

    sinkDown(n:number) {
      // Fetch the element that has to be sunk.
      var element = this.content[n];
      // When at 0, an element can not sink any further.
      while (n > 0) {
        // Compute the parent element's index, and fetch it.
        var parentN = ((n + 1) >> 1) - 1,
          parent = this.content[parentN];
        // Swap the elements if the parent is greater.
        if (this.scoreFunction(element) < this.scoreFunction(parent)) {
          this.content[parentN] = element;
          this.content[n] = parent;
          // Update 'n' to continue at the new position.
          n = parentN;
        }
        // Found a parent that is less, no need to sink any further.
        else {
          break;
        }
      }
    }

    bubbleUp(n:number) {
      // Look up the target element and its score.
      var length = this.content.length,
        element = this.content[n],
        elemScore = this.scoreFunction(element);

      while(true) {
        // Compute the indices of the child elements.
        var child2N = (n + 1) << 1, child1N = child2N - 1;
        // This is used to store the new position of the element,
        // if any.
        var swap = null;
        // If the first child exists (is inside the array)...
        if (child1N < length) {
          // Look it up and compute its score.
          var child1 = this.content[child1N],
            child1Score = this.scoreFunction(child1);
          // If the score is less than our element's, we need to swap.
          if (child1Score < elemScore)
            swap = child1N;
        }
        // Do the same checks for the other child.
        if (child2N < length) {
          var child2 = this.content[child2N],
            child2Score = this.scoreFunction(child2);
          if (child2Score < (swap === null ? elemScore : child1Score))
            swap = child2N;
        }

        // If the element needs to be moved, swap it, and continue.
        if (swap !== null) {
          this.content[n] = this.content[swap];
          this.content[swap] = element;
          n = swap;
        }
        // Otherwise, we are done.
        else {
          break;
        }
      }
    }
  }
  //end graph.js ==================

  // javascript-astar
  // http://github.com/bgrins/javascript-astar
  // Freely distributable under the MIT License.
  // Implements the astar search algorithm in javascript using a binary heap.
  export interface AStarData {
    f:number;
    g:number;
    h:number;
    cost:number;
    visited:boolean;
    closed:boolean;
    parent:AStarData;
    pos:Position;
    org:any;
  }

  export class AStar {
    static NO_CHECK_START_POINT:boolean = false;
    grid:AStarData[][];
    constructor(grid:any[][], disablePoints?:Position[], enableCost?:boolean) {
      this.grid = [];
      for(var x = 0, xl = grid.length; x < xl; x++) {
        this.grid[x] = [];
        for(var y = 0, yl = grid[x].length; y < yl; y++) {
          var cost = (typeof grid[x][y] == "number") ? grid[x][y] : grid[x][y].type;
          if (cost > 1 && !enableCost)
            cost = 1;
          this.grid[x][y] = {
            org: grid[x][y],
            f: 0,
            g: 0,
            h: 0,
            cost: cost,
            visited: false,
            closed: false,
            pos: {
              x: x,
              y: y
            },
            parent: null
          }
        }
      }
      if (disablePoints !== undefined) {
        for (var i=0; i<disablePoints.length; i++)
          this.grid[disablePoints[i].x][disablePoints[i].y].cost = 0;
      }
    }

    heap():BinaryHeap {
      return new BinaryHeap(function(node:AStarData) {
        return node.f;
      });
    }

    _find(org:any) {
      for (var x=0; x<this.grid.length; x++)
        for (var y=0; y<this.grid[x].length; y++)
          if (this.grid[x][y].org == org)
            return this.grid[x][y];
    }

    _search(start:any, end:any, diagonal?:boolean, heuristic?:Function) {
      heuristic = heuristic || this.manhattan;
      diagonal = !!diagonal;

      var openHeap = this.heap();

      var _start:AStarData, _end:AStarData;
      if (start.x !== undefined && start.y !== undefined)
        _start = this.grid[start.x][start.y];
      else
        _start = this._find(start);

      if (end.x !== undefined && end.y !== undefined)
        _end = this.grid[end.x][end.y];
      else
        _end = this._find(end);

      if (AStar.NO_CHECK_START_POINT == false && _start.cost <= 0)
        return [];

      openHeap.push(_start);

      while(openHeap.size() > 0) {

        // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
        var currentNode:AStarData = openHeap.pop();

        // End case -- modal has been found, return the traced path.
        if(currentNode === _end) {
          var curr = currentNode;
          var ret = [];
          while(curr.parent) {
            ret.push(curr);
            curr = curr.parent;
          }
          return ret.reverse();
        }

        // Normal case -- move currentNode from open to closed, process each of its neighbors.
        currentNode.closed = true;

        // Find all neighbors for the current tile. Optionally find diagonal neighbors as well (false by default).
        var neighbors = this.neighbors(currentNode, diagonal);

        for(var i=0, il = neighbors.length; i < il; i++) {
          var neighbor = neighbors[i];

          if(neighbor.closed || neighbor.cost <= 0) {
            // Not a valid tile to process, skip to next neighbor.
            continue;
          }

          // The g score is the shortest distance from start to current tile.
          // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
          var gScore = currentNode.g + neighbor.cost;
          var beenVisited = neighbor.visited;

          if(!beenVisited || gScore < neighbor.g) {

            // Found an optimal (so far) path to this tile.  Take score for tile to see how good it is.
            neighbor.visited = true;
            neighbor.parent = currentNode;
            neighbor.h = neighbor.h || heuristic(neighbor.pos, _end.pos);
            neighbor.g = gScore;
            neighbor.f = neighbor.g + neighbor.h;

            if (!beenVisited) {
              // Pushing to heap will put it in proper place based on the 'f' value.
              openHeap.push(neighbor);
            }
            else {
              // Already seen the tile, but since it has been rescored we need to reorder it in the heap
              openHeap.rescoreElement(neighbor);
            }
          }
        }
      }

      // No modal was found - empty array signifies failure to find path.
      return [];
    }

    static search(grid:any[][], start:any, end:any, disablePoints?:Position[], diagonal?:boolean, heuristic?:Function) {
      var astar = new AStar(grid, disablePoints)
      return astar._search(start, end, diagonal, heuristic);
    }

    manhattan(pos0:Position, pos1:Position):number {
      // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

      var d1 = Math.abs (pos1.x - pos0.x);
      var d2 = Math.abs (pos1.y - pos0.y);
      return d1 + d2;
    }

    neighbors(node:AStarData, diagonals?:boolean):AStarData[] {
      var grid = this.grid;
      var ret = [];
      var x = node.pos.x;
      var y = node.pos.y;

      // West
      if(grid[x-1] && grid[x-1][y]) {
        ret.push(grid[x-1][y]);
      }

      // East
      if(grid[x+1] && grid[x+1][y]) {
        ret.push(grid[x+1][y]);
      }

      // South
      if(grid[x] && grid[x][y-1]) {
        ret.push(grid[x][y-1]);
      }

      // North
      if(grid[x] && grid[x][y+1]) {
        ret.push(grid[x][y+1]);
      }

      if (diagonals) {

        // Southwest
        if(grid[x-1] && grid[x-1][y-1]) {
          ret.push(grid[x-1][y-1]);
        }

        // Southeast
        if(grid[x+1] && grid[x+1][y-1]) {
          ret.push(grid[x+1][y-1]);
        }

        // Northwest
        if(grid[x-1] && grid[x-1][y+1]) {
          ret.push(grid[x-1][y+1]);
        }

        // Northeast
        if(grid[x+1] && grid[x+1][y+1]) {
          ret.push(grid[x+1][y+1]);
        }

      }

      return ret;
    }
  }
}
