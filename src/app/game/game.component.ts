import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {GridService} from "../services/grid.service";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {GameState} from "../store/game.reducer";

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
    // this.grid.new(10, 10, 50);
  }

}
