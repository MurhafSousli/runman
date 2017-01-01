import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {GridService} from "../../service/grid.service";
import {PlayerStates} from "../../models";
import {PlayerSprites} from "../../models/player/player.interface";
import {Helper} from "../../service/grid.helper";

@Component({
  selector: 'player',
  templateUrl: 'player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor(private grid: GridService) {
    this.bloodSprite = Helper.prefixUrl(PlayerSprites.BLOOD);
    this.attackColor = 'rgba(255, 10, 10, 0.6)';
  }

  getStyles() {
    return Object.assign({}, this.styles, {
      left: this.index.x * this.grid.tileSize + "px",
      top: this.index.y * this.grid.tileSize + "px",
      width: this.grid.tileSize + "px",
      height: this.grid.tileSize + "px"
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
