import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core'
import {GameState} from "../../store/game.state"
import {Helper} from "../../service/grid.helper"
import {GridService} from "../../service/grid.service"
import {Observable} from "rxjs/Observable"


@Component({
  selector: 'game-container',
  templateUrl: 'game-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameContainerComponent implements OnInit {

  @Input() state: GameState;
  height;
  width;

  constructor(private grid: GridService) {
  }

  ngOnInit() {
  }


  ngAfterViewInit() {
    this.createGame();
    /** Clone hero when space is clicked */
    Observable.fromEvent(document, 'keyup').subscribe((e: KeyboardEvent) => {
      if (e.keyCode === 32) {
        this.grid.cloneHero();
      }
    });
  }

  createGame() {
    let tileSize = 50;
    // let viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    // let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 110;
    //
    // this.width = Helper.getTileCount(viewWidth, tileSize);
    // this.height = Helper.getTileCount(viewHeight, tileSize);
    //
    // /** Check orientation */
    // if (this.width > this.height) {
    //   this.grid.newGame(this.width, this.height, tileSize)
    // }
    // else {
    //   this.grid.newGame(this.height, this.width, tileSize);
    // }

    this.height = 10;
    this.width = 12;
    this.grid.newGame(this.width, this.height, tileSize);

    console.log(this.width, this.height);

  }
}
