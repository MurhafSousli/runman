import {Player} from "../player/player.model"
import {Index} from "../tile/tile.interface"
import {GridHelper} from "../../helpers"
import {PlayerSprites} from "../../store/game.const"

export class Guard extends Player {

  avatar: string;

  constructor(index: Index) {

    super(index, PlayerSprites.GRIM_REAPER, 'guard');
    this.color = 'rgba(0, 0, 0, .4)';
    this.avatar = GridHelper.prefixUrl(PlayerSprites.GRIM_REAPER_AVATAR);
  }
}
