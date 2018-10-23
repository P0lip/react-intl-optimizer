import uniqid from 'uniqid';

export class MangleMap extends Map {
  constructor(whitelist) {
    super();

    for (const id of whitelist) {
      this.set(id, id);
    }
  }

  get(key) {
    let id = super.get(key);
    if (id !== undefined) {
      return id;
    }

    id = uniqid.process();
    this.set(key, id.length >= key ? key : id);

    return id;
  }
}
