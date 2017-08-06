import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GameService } from '../../service/game.service';

@Component({
  selector: 'app-state-message',
  templateUrl: 'state-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMessageComponent {

  @Input() state;

  constructor(private _game: GameService) {
  }

  public get game(): GameService {
    return this._game;
  }
}
