import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {GridService} from "../services/grid.service";
import {Player} from "./player.model";

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent {

  @Input('data') player: Player;

  constructor(private grid: GridService) {
  }
}
