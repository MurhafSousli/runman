import {Component, Input, ChangeDetectionStrategy} from '@angular/core'
import {GameService} from "../../service/game.service"

@Component({
  selector: 'state-message',
  templateUrl: 'state-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMessageComponent{

  @Input() state;

  constructor(private game: GameService) {
  }

}
