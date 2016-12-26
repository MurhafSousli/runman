import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {GridService} from "../../service/grid.service";

@Component({
  selector: 'tile',
  templateUrl: 'tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent {

  @Input() index;
  @Input() styles;
  @Input() type;
  @Input() sprite;

  constructor(private grid: GridService) {
  }

  getStyles() {
    return Object.assign({}, this.styles, {
      left: this.index.x * this.grid.tileSize + "px",
      top: this.index.y * this.grid.tileSize + "px",
      width: this.grid.tileSize + "px",
      height: this.grid.tileSize + "px"
    });
  }
}
