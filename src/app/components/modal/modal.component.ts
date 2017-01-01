import {Component, Input, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {GridService} from "../../service/grid.service";
import {GameMode} from "../../store/game.reducer";
@Component({
  selector: 'modal',
  templateUrl: 'modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnInit{

  @Input() state;
  @Input() score;
  icon: string;
  text: string;

  constructor(private grid: GridService) {
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
        this.icon = "fa fa-frown-o";
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
      default:
        break
    }
  }

}
