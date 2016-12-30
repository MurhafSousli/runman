import {Player} from "../player/player.model";
import {Index} from "../tile/tile.interface";
import {PlayerSprites} from "../player/player.interface";
import {Helper} from "../../service/grid.helper";

export class Guard extends Player {

  avatar: string;

  constructor(index: Index) {

    super(index, PlayerSprites.GRIM_REAPER, 'guard');
    this.color = 'rgba(255, 10, 10, 0.6)';
    this.avatar = Helper.prefixUrl(PlayerSprites.GRIM_REAPER_AVATAR);
  }
}
