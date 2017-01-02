import {Component, Input, ChangeDetectionStrategy} from '@angular/core'
import {GameService} from "../../service/game.service"

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

  constructor(private game: GameService) {
  }

  getStyles() {
    return Object.assign({}, this.styles, {
      left: this.index.x * this.game.tileSize + "px",
      top: this.index.y * this.game.tileSize + "px",
      width: this.game.tileSize + "px",
      height: this.game.tileSize + "px"
    });
  }
}
