import {Injectable} from '@angular/core';

@Injectable()
export class AudioService {

  removePlayerSound;

  constructor() {
    this.removePlayerSound = new Audio();
    this.removePlayerSound.src = AudioFiles.KILLED;
    this.removePlayerSound.load();
  }

  dead() {
    this.removePlayerSound.play();
  }
  // won(){
  //   this.audio.play();
  // }
  // timeUp(){
  //   this.audio.play();
  // }

}

const AudioFiles = {
  KILLED: "../../assets/sounds/dead.ogg",
  WON: "",
  TIME_UP: ""
};
