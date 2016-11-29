export class Node {

  index: Index;

  /** The size of the node  */
  size: number;

  /** Node backgroundImage */
  image: string;

  /** Determine if a node is a available   */
  isAvailable: boolean;

  constructor(index: Index, isAvailable: boolean, image?: string) {
    this.index = index;
    this.isAvailable = isAvailable;
    this.image = image;
  }

}
export interface Index {
  x: number;
  y: number;
}
