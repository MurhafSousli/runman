import {Player} from "../player/player.model";
import {Index} from "../tile/tile.interface";
import {Helper} from "../../service/grid.helper";

export class Guard extends Player {

  constructor(index: Index) {

    super(index, true);
    this.sprite = Helper.prefixUrl('/../../assets/guard.png');
    this.type += ' guard';
  }
}
