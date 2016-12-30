import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core'
import {Observable} from "rxjs/Observable"
import {Store} from "@ngrx/store"
import {GameState} from "../../store/game.state"

@Component({
  selector: 'game',
  templateUrl: 'game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit {

  gameState: Observable<GameState>;

  constructor(private store: Store<GameState>) {
  }

  ngOnInit() {
    this.gameState = this.store.select<GameState>('gameState');
  }

}
