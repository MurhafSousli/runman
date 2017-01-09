import {Component, OnInit, Input} from '@angular/core';
import {GameService} from "../../service/game.service";
import {GameMode} from "../../store/game.const";

@Component({
  selector: 'result',
  templateUrl: 'result.component.html',
  styleUrls: ['result.component.scss']
})
export class ResultComponent implements OnInit {

  @Input() state;
  @Input() score;
  icon: string;
  text: string;

  constructor(private game: GameService) {
  }

  ngOnInit() {
    this.getResult();
  }

  getResult() {
    switch (this.state) {
      case GameMode.WON:
        this.icon = "fa fa-trophy";
        this.text = "You Won!";
        break;
      case GameMode.LOST:
        this.icon = "fa fa-meh-o";
        this.text = "You Lost!";
        break;
      case GameMode.TIME_UP:
        this.icon = "fa fa-hourglass-o";
        this.text = "Time's up!";
        break;
      case GameMode.PAUSED:
        this.icon = "fa fa-pause";
        this.text = "Paused";
        break;
      default: break;
    }
  }
}
