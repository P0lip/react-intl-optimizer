import { expect } from 'chai';
import randomstring from 'randomstring';
import {
  createReplacer,
  initialReviver,
  renameMessageKeys,
} from './utils';

describe('webpack/utils', () => {
  describe('initialReviver', () => {
    let messages;

    beforeEach(() => {
      messages = {
        en: { a: 'b' },
        pl: { c: 'd' },
        de: {},
      };
    });

    it('should always keep empty key', () => {
      const revive = initialReviver(void 0, '', {});

      expect(revive('', messages))
        .to.equal(messages);
    });

    context('when languages are defined', () => {
      it('should filter out any un-matching language', () => {
        const languages = ['de', 'pl'];
        const revive = initialReviver(languages, '', {});

        expect(revive('en', messages.en))
          .to.be.undefined;
      });

      it('should keep a default language', () => {
        const languages = ['de', 'pl'];
        const revive = initialReviver(languages, 'en', {});

        expect(revive('en', messages.en))
          .to.equal(messages.en);
      });

      it('should keep found language', () => {
        const languages = ['de', 'pl'];
        const revive = initialReviver(languages, '', {});

        expect(revive('de', messages.de))
          .to.equal(messages.de);
      });
    });

    context('when optimization.removeValues is an array', () => {
      it('should drop a property if its value is found in array', () => {
        const value = randomstring.generate();
        const revive = initialReviver(void 0, '', { removeValues: [value] });

        expect(revive('foo', value))
          .to.be.undefined;
      });

      it('should keep a property if its value is not found in array', () => {
        const value = randomstring.generate();
        const revive = initialReviver(void 0, '', { removeValues: ['test'] });

        expect(revive('foo', value))
          .to.be.equal(value);
      });
    });

    context('when optimization.trimWhitespaces is truthy', () => {
      it('should trim any string value', () => {
        const value = randomstring.generate();
        const revive = initialReviver(void 0, '', { trimWhitespaces: true });

        expect(revive('foo', `   ${value}  `))
          .to.equal(value);
      });
    });
  });

  describe('createReplacer', () => {
    it('allows key to be empty', () => {
      const replacer = createReplacer([], null);
      const value = randomstring.generate();

      expect(replacer('', value))
        .to.equal(value);
    });

    context('when foundIds is null', () => {
      it('never removes a key', () => {
        const value = randomstring.generate();
        const key = randomstring.generate();

        const replacer = createReplacer([], null);

        expect(replacer(key, value))
          .to.equal(value);
      });
    });

    context('when foundIds is defined', () => {
      it('keeps property if found in foundIds', () => {
        const value = randomstring.generate();
        const key = randomstring.generate();

        const replacer = createReplacer([], new Set([key]));

        expect(replacer(key, value))
          .to.equal(value);
      });

      it('removes property if missing in foundIds', () => {
        const value = randomstring.generate();
        const key = randomstring.generate();

        const replacer = createReplacer([], new Set());

        expect(replacer(key, value))
          .to.be.undefined;
      });
    });

    context('when whitelist is defined', () => {
      it('keeps property if missing in foundsIds but found in whitelist', () => {
        const value = randomstring.generate();
        const key = randomstring.generate();

        const replacer = createReplacer([key], new Set());

        expect(replacer(key, value))
          .to.equal(value);
      });

      it('removes property if missing in both whitelist and foundIds', () => {
        const value = randomstring.generate();
        const key = randomstring.generate();

        const replacer = createReplacer([], new Set());

        expect(replacer(key, value))
          .to.be.undefined;
      });
    });
  });

  describe('renameMessageKeys', () => {
    it('replaces existing property if its key is found in idMap', () => {
      const OLD_KEY = randomstring.generate();
      const NEW_KEY = randomstring.generate();
      const messages = {
        foo: 'bar',
        [OLD_KEY]: 'baz',
      };

      const idMap = new Map([[OLD_KEY, NEW_KEY]]);
      renameMessageKeys(messages, idMap);

      expect(messages)
        .to.deep.equal({
          foo: 'bar',
          [NEW_KEY]: 'baz',
        });
    });
  });
});
