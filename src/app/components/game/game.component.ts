import {Component, ChangeDetectionStrategy, Input} from '@angular/core'
import {GameService} from "../../service/game.service"

@Component({
  selector: 'game',
  templateUrl: 'game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent {

  @Input('state') gameState;

  constructor(private game: GameService) {
  }

}
