import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Store} from "@ngrx/store";
import {GridService} from "../services/grid.service";
import {GameState} from "../store/game.state";

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit {

  gameState: Observable<GameState>;
  mouseStream$: Subject<any> = new Subject();
  effect;

  constructor(private grid: GridService, store: Store<GameState>) {
    this.gameState = store.select<GameState>('gameState');
  }


  ngOnInit() {
    // this.mouseStream$.subscribe((e) => {

    // });
  }

  clickEffect(e){
    this.effect = true;
    this.effect = {
      top: e.clientX,
      left: e.clientY
    };
    setTimeout(()=>{
      this.effect = false;
    }, 1000);
    console.log(e.clientX, e.clientY);
  }


}
