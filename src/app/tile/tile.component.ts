import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {GridService} from "../services/grid.service";
import {Player} from "../player/player.model";

@Component({
  selector: 'tile',
  templateUrl: 'tile.component.html',
  styleUrls: ['tile.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent{

  @Input('data') tile: Player;

  constructor(private grid: GridService) {
  }

}
