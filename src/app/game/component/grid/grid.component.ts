import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { GameService } from '../../service/game.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {

  @Input() tileSize: number;

  constructor(public game: GameService) {
  }
}
