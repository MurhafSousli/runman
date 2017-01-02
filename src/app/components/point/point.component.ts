import {Component, Input, ChangeDetectionStrategy} from '@angular/core'
import {Index} from "../../models"
import {GameService} from "../../service/game.service"

@Component({
  selector: 'point',
  templateUrl: './point.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PointComponent {

  @Input() index: Index;
  @Input() color: string;

  constructor(private game: GameService) { }
}
