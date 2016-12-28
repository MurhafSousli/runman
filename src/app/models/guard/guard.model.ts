import {Player} from "../player/player.model";
import {Index} from "../tile/tile.interface";
import {PlayerSprites} from "../player/player.interface";

export class Guard extends Player {

  constructor(index: Index) {

    super(index, PlayerSprites.GRIM_REAPER, 'guard');
    this.color = 'rgba(255, 10, 10, 0.6)';
  }
}
