import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import {GridService} from "../services/grid.service";
import {Player} from "../models/player.model";

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent implements OnInit {
  @Input('data') player: Player;

  constructor(private grid: GridService) {
  }

  ngOnInit() {
  }

  getStyle() {
    let styles = {
      left: this.player.index.x * this.grid.nodeSize + "px",
      top: this.player.index.y * this.grid.nodeSize + "px",
      width: this.grid.nodeSize + "px",
      height: this.grid.nodeSize + "px",
      background: this.player.image,
      backgrounSize: "192px 192px",
      backgroundRepeat: "no-repeat"
    };
    return styles;
  }
}
