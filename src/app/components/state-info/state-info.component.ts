import {Component, Input, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {GameState} from "../../store/game.state";
import {GridService} from "../../service/grid.service";

@Component({
  selector: 'state-info',
  templateUrl: 'state-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateInfoComponent implements OnInit{

  @Input() state: GameState;

  constructor(private grid: GridService){
  }

  ngOnInit(){
  }

  heroLives() {
    let lives = [];
    for (let i = 0; i < 3; i++)
      (i < this.state.hero.lives.length) ? lives.push(this.state.hero.lives[i]) : lives.push(false);
    return lives;
  }

}
