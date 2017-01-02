import {Injectable} from '@angular/core';
import {Helper} from "../helpers/helper";

@Injectable()
export class AudioService {

  removePlayerSound;

  constructor() {
    this.removePlayerSound = new Audio();
    this.removePlayerSound.src = Helper.prefixUrl(AudioFiles.KILLED);
    this.removePlayerSound.load();
  }

  dead() {
    this.removePlayerSound.play();
  }

}

const AudioFiles = {
  KILLED: "../../assets/sounds/dead.ogg",
  WON: "",
  TIME_UP: ""
};
