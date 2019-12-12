import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { GameService } from '../service/game.service';
import { Index } from '../models';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit {

  @Input() cols: number = 12;
  @Input() rows: number = 10;
  @Input() debug: boolean;
  @Input() debugDelay: number;

  constructor(public game: GameService) {
  }

  ngOnInit() {
    this.game.newGame(this.cols, this.rows, this.debug, this.debugDelay);
  }

  clicked(e: MouseEvent) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const x = el.getAttribute('x');
    const y = el.getAttribute('y');
    let index: Index;
    if (x && y) {
      index = { x: Number(x), y: Number(y) };
      this.game.moveHero(index);
    }
  }
}
