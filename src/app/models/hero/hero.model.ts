import {Player} from "../player/player.model"
import {Index} from "../tile/tile.interface"
import {PlayerSprites} from "../../store/game.const"

export class Hero extends Player {

  constructor(index: Index) {

    super(index, PlayerSprites.HERO, 'hero');
    this.lives = [true, true, true];
    this.speed = 250;
    this.color = 'rgba(39, 153, 64, 0.6)';
    this.bot = false;
  }
}
