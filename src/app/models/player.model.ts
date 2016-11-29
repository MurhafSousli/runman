import {Node, Index} from "./node.model";

export class Player extends Node{


  constructor(index: Index, isAvailable: boolean, image?: string){
    super(index, isAvailable, image);
  }
}
