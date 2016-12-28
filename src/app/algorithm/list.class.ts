export class List<T> extends Array<T>{

  remove(item){
    let index = this.indexOf(item);
    if (index !== -1) return this.splice(index, 1);
  }
  contains(item): boolean{
    return this.indexOf(item) !== -1;
  }
}
