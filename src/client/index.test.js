import sinon from 'sinon';
import proxyquire from 'proxyquire';
import chai from 'chai';
import asPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import randomstring from 'randomstring';

const { expect } = chai;

chai.use(sinonChai);
chai.use(asPromised);

describe('Client', () => {
  let getMessages;
  let db;
  let sandbox;
  let fetchStub;
  let customManifest;

  before(() => {
    sandbox = sinon.createSandbox();
    db = function () {};
    db.prototype.open = sandbox.stub();
    db.prototype.getItem = sandbox.stub();
    db.prototype.setItem = sandbox.stub();

    getMessages = proxyquire('./', {
      './db': {
        default: db,
      },
    }).default;
  });

  beforeEach(() => {
    customManifest = {
      en: {
        empty: true,
        checksum: randomstring.generate(),
        path: 'messages/en.json',
      },
      pl: {
        empty: false,
        checksum: randomstring.generate(),
        path: 'messages/test/pl.json',
      },
      de: {
        empty: false,
        checksum: randomstring.generate(),
        path: 'german.json',
      },
    };

    // eslint-disable-next-line no-underscore-dangle
    global.__REACT_INTL_OPTIMIZER__ = customManifest;
  });

  beforeEach(() => {
    fetchStub = sandbox.stub();
    global.fetch = fetchStub;
  });

  afterEach(() => {
    // eslint-disable-next-line no-underscore-dangle
    delete global.__REACT_INTL_OPTIMIZER__;
    delete global.fetch;
    sandbox.resetHistory();
    sandbox.resetBehavior();
  });

  it('should accept custom manifest', () => {
    let accessed = false;
    const langKey = 'en';
    const manifest = {
      get [langKey]() {
        accessed = true;
        return { empty: true };
      },
    };

    getMessages(langKey, manifest);
    expect(accessed).to.be.true;
  });

  it('should not require custom manifest and use a default one', () => {
    expect(getMessages('en'))
      .to.be.empty;
  });

  it('should throw if existing does not exist', () => {
    const langKey = randomstring.generate();
    return expect(getMessages(langKey))
      .to.be.rejectedWith(TypeError, `manifest[${langKey}] is undefined`);
  });

  context('when language is empty', () => {
    const langKey = 'en';
    let manifest;

    beforeEach(() => {
      manifest = {
        [langKey]: {
          empty: true,
        },
      };
    });

    it('should return empty object', () => {
      expect(getMessages(langKey, manifest))
        .to.be.empty;
    });
  });

  context('when language is contained within manifest and is not empty', () => {
    describe('caching', () => {
      beforeEach(() => {
        fetchStub.returns({
          then() {},
        });
      });

      it('should try retrieving item from db', () => {
        getMessages('de');
        expect(db.prototype.getItem)
          .to.be.called;
      });

      it('should compare checksums and return the messages if they match', () => {
        const messages = {
          foo: 'bar',
        };
        db.prototype.getItem.resolves({
          checksum: customManifest.de.checksum,
          messages,
        });

        return expect(getMessages('de'))
          .eventually.to.equal(messages);
      });

      it('should continue if checksums do not match', () => {
        const err = 'fetch error';
        db.prototype.getItem.resolves({
          checksum: randomstring.generate(),
        });

        fetchStub.throws(new Error(err));

        return expect(getMessages('de'))
          .to.be.rejectedWith(err);
      });

      it('should continue if any exception is thrown', () => {
        const err = 'fetch error';
        db.prototype.getItem.rejects();
        fetchStub.throws(new Error(err));

        return expect(getMessages('de'))
          .to.be.rejectedWith(err);
      });
    });

    describe('fetching', () => {
      let messages;

      beforeEach(() => {
        db.prototype.getItem.throws();
        messages = {
          test: randomstring.generate(),
        };

        fetchStub.resolves({
          ok: true,
          json: sandbox.stub().resolves(messages),
        });
      });

      it('should make a fetch request using provided path', () => getMessages('pl')
        .then(() => {
          expect(fetchStub)
            .to.be.calledWith(customManifest.pl.path);
        }),
      );

      it('should check response.ok and rethrow error if applicable', () => {
        const statusText = randomstring.generate();
        fetchStub.resolves({
          ok: false,
          statusText,
        });

        return expect(getMessages('pl'))
          .to.be.rejectedWith(statusText);
      });

      it('should store the result in db', () => getMessages('pl')
        .then(() => {
          expect(db.prototype.setItem)
            .to.be.calledWith('pl', customManifest.pl.checksum, messages);
        }),
      );

      it('should ignore db errors during saving', () => {
        db.prototype.setItem.throws();

        return expect(getMessages('pl'))
          .to.eventually.equal(messages);
      });

      it('should return fetched messages', () => expect(getMessages('pl'))
        .to.eventually.equal(messages),
      );
    });
  });

  context('when checksum is undefined', () => {
    beforeEach(() => {
      fetchStub.resolves({
        ok: true,
        json: sandbox.stub().resolves({}),
      });
      customManifest.de.checksum = undefined;
    });

    it('should ignore cache', () => getMessages('de')
      .then(() => {
        expect(db.prototype.getItem)
          .not.to.be.called;
      }),
    );

    it('should not save to cache', () => getMessages('de')
      .then(() => {
        expect(db.prototype.setItem)
          .not.to.be.called;
      }),
    );
  });
});
