import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import {GameState} from "../store/game.state";

@Component({
  selector: 'state-info',
  templateUrl: './state-info.component.html',
  styleUrls: ['./state-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateInfoComponent {

  @Input() state: GameState;

  constructor(){
  }

}
