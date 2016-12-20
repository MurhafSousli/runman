import {Player} from "../player/player.model";
import {Index} from "../tile/tile.interface";
import {Helper} from "../../services/grid.helper";

export class Guard extends Player {

  constructor(index: Index) {

    super(index, false);
    this.sprite = Helper.prefixUrl('/../../assets/guard.png');
  }
}
