import { PlayerSprites } from '../models';
import { Player, PlayerParams } from './player';

export class Hero extends Player {
  constructor(params: PlayerParams) {
    super({
      ...params,
      ...{
        type: 'hero',
        className: 'hero',
        sprite: PlayerSprites.HERO,
        bot: false,
        color: 'rgba(39, 153, 64, 0.6)',
        speed: 250,
        lives: [true, true, true]
      }
    });
  }
}
