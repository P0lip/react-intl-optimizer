import { expect } from 'chai';
import randomstring from 'randomstring';
import {
  createReplacer,
  renameMessageKeys,
} from './utils';

describe('webpack/utils', () => {
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
      const KEY = randomstring.generate();
      const NEW_KEY = randomstring.generate();
      const messages = {
        foo: 'bar',
        [KEY]: 'baz',
      };

      const idMap = new Map([[NEW_KEY, KEY]]);
      renameMessageKeys(messages, idMap);

      expect(messages)
        .to.deep.equal({
          foo: 'bar',
          [NEW_KEY]: 'baz',
        });
    });
  });
});
