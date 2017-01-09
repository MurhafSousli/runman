import {Component, Input, ChangeDetectionStrategy} from '@angular/core'
import {GameService} from "../../service/game.service"
import {GridHelper} from "../../helpers/grid.helper"
import {PlayerSprites, PlayerStates} from "../../store/game.const"

@Component({
  selector: 'player',
  templateUrl: 'player.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent {

  @Input() index;
  @Input() styles;
  @Input() type;
  @Input() sprite;
  @Input() state;
  @Input() action;
  @Input() direction;
  @Input() blood;
  @Input() color;
  @Input() route;

  bloodSprite;
  attackColor;

  constructor(private game: GameService) {
    this.bloodSprite = GridHelper.prefixUrl(PlayerSprites.BLOOD);
    this.attackColor = 'rgba(255, 10, 10, 0.6)';
  }

  getStyles() {
    return Object.assign({}, this.styles, {
      left: this.index.x * this.game.tileSize + "px",
      top: this.index.y * this.game.tileSize + "px",
      width: this.game.tileSize + "px",
      height: this.game.tileSize + "px"
    });
  }

  getClasses() {
    let direction = this.direction || '';
    switch (this.state) {
      case PlayerStates.IDLE:
        return direction + ' idle';
      case PlayerStates.DEAD:
        return 'dead';
      default:
        return direction;
    }
  }
}
