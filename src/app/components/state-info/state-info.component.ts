import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GameState } from '../../store/game.state';
import { GameService } from '../../service/game.service';

@Component({
  selector: 'app-state-info',
  templateUrl: 'state-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateInfoComponent {

  @Input() state: GameState;

  constructor(private _game: GameService) {
  }

  public get game(): GameService {
    return this._game;
  }

  public heroLives() {
    const lives = [];
    for (let i = 0; i < 3; i++) {
      (i < this.state.hero.lives.length) ? lives.push(this.state.hero.lives[i]) : lives.push(false);
    }
    return lives;
  }
}
