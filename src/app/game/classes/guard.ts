import { PlayerSprites } from '../models';
import { Player, PlayerParams } from './player';

export class Guard extends Player {
  avatar: string;

  constructor(params: PlayerParams) {
    super({
      ...params,
      ...{
        type: 'guard',
        className: 'guard',
        sprite: PlayerSprites.GRIM_REAPER,
        color: 'rgba(0, 0, 0, .4)'
      }
    });
    this.avatar = PlayerSprites.GRIM_REAPER_AVATAR;
  }
}
