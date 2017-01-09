import {Component, Input, ChangeDetectionStrategy} from '@angular/core'
import {Index} from "../../models"
import {GameSettings} from "../../store/game.const"

@Component({
  selector: 'point',
  templateUrl: './point.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PointComponent {

  @Input() index: Index;
  @Input() color: string;

  getStyles() {
    return {
      left: `${this.index.x * GameSettings.TILE_SIZE}px`,
      top: `${this.index.y * GameSettings.TILE_SIZE}px`,
      width: `${GameSettings.TILE_SIZE}px`,
      height: `${GameSettings.TILE_SIZE}px`
    };
  }

}
