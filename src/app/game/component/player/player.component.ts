import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { PlayerSprites, PlayerStates, PlayerState } from '../../models';
import { GameService } from '../../service/game.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss', './hero.scss', './guard.scss', './blood.scss', './flag.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent implements OnInit {

  state$: Observable<PlayerState>;
  @Input() name: string;

  constructor(private game: GameService) {
  }

  ngOnInit() {
    this.state$ = this.game.getPlayerState(this.name).pipe(tap((x) => console.log('player state', x)));
  }

  // bloodSprite = PlayerSprites.BLOOD;
  // attackColor = 'rgba(255, 10, 10, 0.6)';

  // ngOnChanges() {
  //   console.log('player state', this.state);
  //   if (this.state) {
  //     if (this.state.index) {
  //       this.styles = {
  //         left: this.state.index.x * this.size + 'px',
  //         top: this.state.index.y * this.size + 'px',
  //         width: this.size + 'px',
  //         height: this.size + 'px',
  //         transition: `all linear ${this.state.speed}ms`
  //       };
  //     }
  //
  //     const direction = this.state.direction || '';
  //     switch (this.state.status) {
  //       case PlayerStates.IDLE:
  //         this.classes = direction + ' idle';
  //         break;
  //       case PlayerStates.DEAD:
  //         this.classes = 'dead';
  //         break;
  //       default:
  //         this.classes = direction;
  //     }
  //   }
  // }

}
