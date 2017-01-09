import {Injectable} from '@angular/core';
import {GridHelper} from "../helpers";
import {AudioFiles} from "../store/game.const";

@Injectable()
export class AudioService {

  remove;
  attack;
  win;
  gameOver;
  pause;
  music;

  constructor() {
    this.remove = this.loadSound(AudioFiles.REMOVE);
    this.attack = this.loadSound(AudioFiles.ATTACK);
    this.win = this.loadSound(AudioFiles.WIN);
    this.gameOver = this.loadSound(AudioFiles.GAME_OVER);
    this.pause = this.loadSound(AudioFiles.PAUSE);
    this.music = this.loadSound(AudioFiles.MUSIC);
    this.music.loop = true;
  }

  private loadSound(src: string){
    let audio = new Audio();
    audio.src = GridHelper.prefixUrl(src);
    audio.load();
    return audio;
  }

}

