import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameService } from '../../service/game.service';

@Component({
  selector: 'app-about',
  templateUrl: 'about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {

  constructor(private _game: GameService) {
  }

  public get game(): GameService {
    return this._game;
  }
}
