import {Player} from "../player/player.model";
import {Index} from "../tile/tile.interface";
import {PlayerSprites} from "../player/player.interface";

export class Hero extends Player {

  /** hero cloned players */
  clones: Player[];

  constructor(index: Index) {

    super(index, PlayerSprites.HERO, 'hero');
    this.clones = [];
    this.lives = [true, true, true];
    this.speed = 250;
    this.color = 'rgba(10, 160, 2, 0.6)';
  }
}
