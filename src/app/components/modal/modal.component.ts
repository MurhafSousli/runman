import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {GridService} from "../../service/grid.service";
import {GameModal} from "../../store/game.reducer";

@Component({
  selector: 'modal',
  templateUrl: 'modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {

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
      case GameModal.WON:
        this.icon = "fa fa-trophy";
        this.text = "You Won!";
        break;
      case GameModal.LOST:
        this.icon = "fa fa-frown-o";
        this.text = "You Lost!";
        break;
      case GameModal.TIME_UP:
        this.icon = "fa fa-hourglass-o";
        this.text = "Time's up!";
        break;
      case GameModal.PAUSED:
        this.icon = "fa fa-pause";
        this.text = "Paused";
        break;
      default:
        break
    }
  }

}
