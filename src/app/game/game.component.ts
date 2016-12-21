import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Store} from "@ngrx/store";
import {GridService} from "../service/grid.service";
import {GameState} from "../store/game.state";

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit {

  gameState: Observable<GameState>;

  constructor(private grid: GridService, store: Store<GameState>) {
    this.gameState = store.select<GameState>('gameState');
  }

  ngOnInit() {
  }


}
