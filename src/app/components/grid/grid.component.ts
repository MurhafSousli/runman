import {Component, Input, ChangeDetectionStrategy} from '@angular/core'
import {GameState} from "../../store/game.state"
import {GameService} from "../../service/game.service"

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {
  @Input() height: number;
  @Input() width: number;
  @Input() state: GameState;

  constructor(private game: GameService) {

  }
}
