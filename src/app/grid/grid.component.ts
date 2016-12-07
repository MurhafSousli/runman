import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {GameState} from "../store/game.reducer";


@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {
 @Input() height: number;
 @Input() width: number;
 @Input() state: GameState;

}
