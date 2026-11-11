// @flow
export default class Store extends Map {
  constructor(backingObject: any) {
    super();
    this.backingObject = backingObject;
  }

  set(key: any, val: any) {
    super.set(key, val);
    this.backingObject[key] = val;
  }

  getBackingObject(): any {
    return this.backingObject;
  }
}
