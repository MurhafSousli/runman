import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GameService } from '../../service/game.service';

@Component({
  selector: 'app-tile',
  templateUrl: 'tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent {

  @Input() index;
  @Input() styles;
  @Input() type;
  @Input() sprite;

  constructor(private _game: GameService) {
  }

  public get game(): GameService {
    return this._game;
  }

  getStyles() {
    return Object.assign({}, this.styles, {
      left: this.index.x * this.game.tileSize + 'px',
      top: this.index.y * this.game.tileSize + 'px',
      width: this.game.tileSize + 'px',
      height: this.game.tileSize + 'px'
    });
  }
}
