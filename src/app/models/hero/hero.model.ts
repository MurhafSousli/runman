import {Player} from "../player/player.model";
import {Index} from "../tile/tile.interface";
import {Helper} from "../../services/grid.helper";

export class Hero extends Player {

  lives = [true, true, true];

  constructor(index: Index) {

    super(index, false);
    this.sprite = Helper.prefixUrl('/../../assets/hero.png');
  }
}
