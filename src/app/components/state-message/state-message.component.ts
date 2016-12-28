import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {GridService} from "../../service/grid.service";
import {Helper} from "../../service/grid.helper";

@Component({
  selector: 'state-message',
  templateUrl: 'state-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMessageComponent{

  @Input() state;
  grimReaper:string;

  constructor(private grid: GridService) {
    this.grimReaper = Helper.prefixUrl('../../assets/reaper.png');
  }

}
