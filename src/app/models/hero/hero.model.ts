import {Player} from "../player/player.model";
import {Index} from "../tile/tile.interface";
import {Helper} from "../../service/grid.helper";

export class Hero extends Player {

  /** hero clonned players */
  clones: Player[] = [];

  constructor(index: Index) {

    super(index, false);
    this.sprite = Helper.prefixUrl('/../../assets/hero.png');
    this.lives = [true, true, true];
  }
}
