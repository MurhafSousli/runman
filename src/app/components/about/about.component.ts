import {Component, ChangeDetectionStrategy} from '@angular/core';
import {GameService} from "../../service/game.service";

@Component({
  selector: 'about',
  templateUrl: 'about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent{

  constructor(private game :GameService){

  }
}
