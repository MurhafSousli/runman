import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {GridService} from "../services/grid.service";
import {Player} from "../models/player/player.model";
import {PlayerState} from "../models/player/player.interface";

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent {

  @Input('data') player: Player;

  constructor(private grid: GridService) {
  }

  getStyles() {
    if (this.player) {
      return Object.assign({}, this.player.styles, {
        left: this.player.index.x * this.grid.tileSize + "px",
        top: this.player.index.y * this.grid.tileSize + "px",
        width: this.grid.tileSize + "px",
        height: this.grid.tileSize + "px"
      })
    }
  }

  getClasses() {
    if (this.player) {
      if (this.player.state === PlayerState.IDLE)
        return this.player.direction + ' idle';
      return this.player.direction;
    }
  }
}
