import {Player} from "../player/player.model";
import {Index} from "../tile/tile.interface";
import {prefixUrl} from "../../services/grid.service";

export class Hero extends Player {

  constructor(index: Index) {

    super(index, false);
    this.sprite = prefixUrl('/../../assets/hero.png');
  }
}
