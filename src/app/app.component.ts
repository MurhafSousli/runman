import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { GameState } from './store/game.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  public gameState: Observable<GameState>;

  constructor(private store: Store<GameState>) {
  }

  ngOnInit() {
    this.gameState = this.store.select<GameState>('gameState');
  }
}
