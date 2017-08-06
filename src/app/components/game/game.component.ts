import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GameService } from '../../service/game.service';

@Component({
  selector: 'app-game',
  templateUrl: 'game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent {

  @Input() gameState;

  constructor(private _game: GameService) {
  }

  public get game(): GameService {
    return this._game;
  }
}
