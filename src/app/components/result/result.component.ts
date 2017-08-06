import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../../service/game.service';
import { GameMode } from '../../store/game.const';

@Component({
  selector: 'app-result',
  templateUrl: 'result.component.html'
})
export class ResultComponent implements OnInit {

  @Input() state;
  @Input() score;
  icon: string;
  text: string;

  constructor(private _game: GameService) {
  }

  ngOnInit() {
    this.getResult();
  }

  public get game(): GameService {
    return this._game;
  }

  getResult() {
    switch (this.state) {
      case GameMode.WON:
        this.icon = 'fa fa-trophy';
        this.text = 'You Won!';
        break;
      case GameMode.LOST:
        this.icon = 'fa fa-meh-o';
        this.text = 'You Lost!';
        break;
      case GameMode.TIME_UP:
        this.icon = 'fa fa-hourglass-o';
        this.text = 'Time\'s up!';
        break;
      case GameMode.PAUSED:
        this.icon = 'fa fa-pause';
        this.text = 'Paused';
        break;
      default: break;
    }
  }
}
