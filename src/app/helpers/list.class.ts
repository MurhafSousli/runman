export class List<T> extends Array<T> {

  constructor(...m: T[]) {
    if (m.length === 1) {
      super(m[0]);
    } else if (m.length === 0) {
      super();
    }
    Object.setPrototypeOf(this, List.prototype);
  }

  remove(item) {
    const index = this.indexOf(item);
    if (index !== -1) {
      return this.splice(index, 1);
    }
  }

  contains(item): boolean {
    return this.indexOf(item) !== -1;
  }
}
