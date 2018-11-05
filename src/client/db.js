export default class Database {
  constructor({ name, version, storeName }) {
    this.name = name;
    this.version = version;
    this.storeName = storeName;
    this.db = null;

    this.open();
  }

  open() {
    return new Promise((resolve, reject) => {
      const req = global.indexedDB.open(this.name, this.version);

      req.onsuccess = ({ target }) => {
        this.db = target.result;
      };

      req.onerror = ({ target }) => {
        reject(target.errorCode);
      };

      req.onupgradeneeded = ({ currentTarget }) => {
        currentTarget.result.createObjectStore(
          this.storeName,
          { keyPath: 'langKey', autoIncrement: true },
        );

        resolve(this.db);
      };
    });
  }

  getStore(mode = 'readonly') {
    return this.db
      .transaction(this.storeName, mode)
      .objectStore(this.storeName);
  }

  getItem(key) {
    const store = this.getStore();

    return new Promise((resolve, reject) => {
      const req = store.get(key);
      req.onsuccess = ({ target }) => {
        if (target.result !== undefined) {
          resolve(target.result);
        } else {
          reject();
        }
      };

      req.onerror = function () {
        reject(this.error);
      };
    });
  }

  setItem(langKey, checksum, messages) {
    const store = this.getStore('readwrite');

    return new Promise((resolve, reject) => {
      const req = store.put({ langKey, checksum, messages });
      req.onsuccess = resolve;
      req.onerror = function () {
        reject(this.error);
      };
    });
  }
}
