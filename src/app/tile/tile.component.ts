import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {GridService} from "../services/grid.service";
import {Tile} from "../models/tile/tile.model";

@Component({
  selector: 'tile',
  templateUrl: 'tile.component.html',
  styleUrls: ['tile.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent {

  @Input('data') tile: Tile;

  constructor(private grid: GridService) {
  }

  getStyles() {
    return Object.assign({}, this.tile.styles, {
      left: this.tile.index.x * this.grid.tileSize + "px",
      top: this.tile.index.y * this.grid.tileSize + "px",
      width: this.grid.tileSize + "px",
      height: this.grid.tileSize + "px"
    });
  }
}
