import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Index } from '../../models/game.model';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PointComponent {

  @Input() index: Index;
  @Input() color: string;
  @Input() size: number;

  getStyles() {
    return {
      left: `${this.index.x * this.size}px`,
      top: `${this.index.y * this.size}px`,
      width: `${this.size}px`,
      height: `${this.size}px`
    };
  }
}
