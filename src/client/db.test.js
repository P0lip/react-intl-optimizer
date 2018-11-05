/* eslint-disable no-new */
import sinon from 'sinon';
import chai from 'chai';
import asPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import randomstring from 'randomstring';
import Database from './db';

const { expect } = chai;

chai.use(sinonChai);
chai.use(asPromised);

describe('Client/Database', () => {
  let sandbox;
  let config;

  beforeEach(() => {
    config = {
      name: randomstring.generate(),
      storeName: randomstring.generate(),
      version: parseInt(Math.random() * 1000000, 10),
    };

    sandbox = sinon.createSandbox();

    global.indexedDB = {
      open: sandbox.stub().returns({}),
    };
  });

  afterEach(() => {
    delete global.indexedDB;
    sandbox.restore();
  });

  it('should call #open during initialization', () => {
    const openSpy = sandbox.spy(Database.prototype, 'open');
    new Database({});
    expect(openSpy)
      .to.be.called;
  });

  describe('#open', () => {
    beforeEach(() => {
      global.indexedDB.open.returns({});
    });

    it('should call indexedDB.open', () => {
      global.indexedDB.open.returns({});

      new Database(config);

      expect(global.indexedDB.open)
        .to.be.calledWith(config.name, config.version);
    });

    it('should assign a db when request succeeds', () => {
      const dbStub = {};

      global.indexedDB.open
        .withArgs(config.name, config.version)
        .returns({
          set onsuccess(cb) {
            cb.call({}, { target: { result: dbStub } });
          },
        });

      const database = new Database(config);
      expect(database.db)
        .to.equal(dbStub);
    });

    it('should reject the promise with error code when request fails', () => {
      const errorCode = randomstring.generate();

      const database = new Database(config);

      global.indexedDB.open
        .withArgs(config.name, config.version)
        .returns({
          set onerror(cb) {
            cb.call({}, { target: { errorCode } });
          },
        });

      return expect(database.open())
        .to.be.rejectedWith(errorCode);
    });

    it('should resolve the promise when upgradeneeded is dispatched', () => {
      const database = new Database(config);
      const dbStub = {};

      global.indexedDB.open
        .withArgs(config.name, config.version)
        .returns({
          set onsuccess(cb) {
            cb.call({}, { target: { result: dbStub } });
          },
          set onupgradeneeded(cb) {
            cb.call(
              {},
              {
                currentTarget: {
                  result: {
                    createObjectStore() {},
                  },
                },
              });
          },
        });

      return expect(database.open())
        .to.eventually.equal(dbStub);
    });

    it('should create a new object store when upgradeneeded is dispatched', () => {
      const database = new Database(config);
      const createObjectStore = sandbox.stub();

      global.indexedDB.open
        .withArgs(config.name, config.version)
        .returns({
          set onupgradeneeded(cb) {
            cb.call(
              {},
              {
                currentTarget: {
                  result: {
                    createObjectStore,
                  },
                },
              });
          },
        });

      database.open();
      expect(createObjectStore)
        .to.be.calledWith(config.storeName, {
          keyPath: 'langKey',
          autoIncrement: true,
        });
    });
  });

  describe('#getStore', () => {
    let dbStub;

    beforeEach(() => {
      dbStub = {};
      dbStub.transaction = sandbox.stub().returns(dbStub);
      dbStub.objectStore = sandbox.stub();

      sandbox.stub(Database.prototype, 'open').returns({});
    });

    it('should get an object store', () => {
      const database = new Database({});
      database.db = dbStub;

      const store = {};
      dbStub.objectStore.returns(store);

      expect(database.getStore())
        .to.equal(store);
    });

    it('should perform a transaction in readonly mode by default', () => {
      const database = new Database(config);
      database.db = dbStub;

      database.getStore();
      expect(dbStub.transaction)
        .to.be.calledWith(config.storeName, 'readonly');
    });

    it('should allow you to set custom transaction mode', () => {
      const database = new Database(config);
      database.db = dbStub;

      database.getStore('readwrite');

      expect(dbStub.transaction)
        .to.be.calledWith(config.storeName, 'readwrite');
    });
  });

  describe('#getItem', () => {
    let storeStub;

    beforeEach(() => {
      const dbStub = {
        transaction: () => ({
          objectStore: () => storeStub,
        }),
      };
      global.indexedDB.open
        .withArgs(config.name, config.version)
        .returns({
          set onsuccess(cb) {
            cb.call({}, { target: { result: dbStub } });
          },
        });

      storeStub = {
        put: sandbox.stub(),
        get: sandbox.stub(),
      };
    });

    it('should resolve the promise with retrieved item', () => {
      const database = new Database(config);
      const key = randomstring.generate();
      const result = randomstring.generate();

      storeStub.get
        .withArgs(key)
        .returns({
          set onsuccess(cb) {
            cb.call({}, { target: { result } });
          },
        });

      return expect(database.getItem(key))
        .to.eventually.equal(result);
    });

    it('should reject the promise if retrieved item is undefined', () => {
      const database = new Database(config);
      const key = randomstring.generate();

      storeStub.get
        .withArgs(key)
        .returns({
          set onsuccess(cb) {
            cb.call({}, { target: { result: void 0 } });
          },
        });

      return expect(database.getItem(key))
        .to.be.rejected;
    });

    it('should reject the promise on error', () => {
      const database = new Database(config);
      const key = randomstring.generate();
      const error = randomstring.generate();

      storeStub.get
        .withArgs(key)
        .returns({
          set onerror(cb) {
            cb.call({ error });
          },
        });

      return expect(database.getItem(key))
        .to.be.rejectedWith(error);
    });
  });

  describe('#setItem', () => {
    let storeStub;

    beforeEach(() => {
      const dbStub = {
        transaction: () => ({
          objectStore: () => storeStub,
        }),
      };
      global.indexedDB.open
        .withArgs(config.name, config.version)
        .returns({
          set onsuccess(cb) {
            cb.call({}, { target: { result: dbStub } });
          },
        });

      storeStub = {
        put: sandbox.stub(),
        get: sandbox.stub(),
      };
    });

    it('should call store.put with proper data', () => {
      const langKey = randomstring.generate();
      const checksum = randomstring.generate();
      const messages = {
        [randomstring.generate()]: randomstring.generate(),
        [randomstring.generate()]: randomstring.generate(),
      };

      storeStub.put.returns({});

      const database = new Database(config);
      database.setItem(langKey, checksum, messages);

      expect(storeStub.put)
        .to.be.calledWith({
          langKey,
          checksum,
          messages,
        });
    });

    it('should resolve the promise on success', () => {
      const database = new Database(config);
      const key = randomstring.generate();
      const result = randomstring.generate();

      storeStub.put
        .returns({
          set onsuccess(cb) {
            cb.call({}, { target: { result } });
          },
        });

      return expect(database.setItem(key))
        .to.eventually.deep.equal({
          target: {
            result,
          },
        });
    });

    it('should reject the promise on error', () => {
      const database = new Database(config);
      const key = randomstring.generate();
      const error = randomstring.generate();

      storeStub.put
        .returns({
          set onerror(cb) {
            cb.call({ error });
          },
        });

      return expect(database.setItem(key))
        .to.be.rejectedWith(error);
    });
  });
});
