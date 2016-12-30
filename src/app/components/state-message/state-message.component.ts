import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {GridService} from "../../service/grid.service";

@Component({
  selector: 'state-message',
  templateUrl: 'state-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMessageComponent{

  @Input() state;

  constructor(private grid: GridService) {
  }

}
