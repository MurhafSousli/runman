import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Search, TileState } from '../../models';
import { GameService } from '../../service/game.service';
import { Observable } from 'rxjs';
import { TileNode } from '../../classes';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent implements OnInit, OnChanges {

  styles: any;
  @Input() state: TileState;
  @Input() size: number;
  @Input() debug: number;

  debugState$: Observable<Search>;

  constructor(private game: GameService) {
  }

  ngOnInit() {
    this.debugState$ = this.game.getNodeState(this.state.index).pipe(map(state => state.search));
  }

  ngOnChanges() {
    this.styles = {
      left: this.state.index.x * this.size + 'px',
      top: this.state.index.y * this.size + 'px',
      width: this.size + 'px',
      height: this.size + 'px'
    };
  }

}
