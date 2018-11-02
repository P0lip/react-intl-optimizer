import { expect } from 'chai';
import ReactIntlOptimizer from '.';

describe('ReactIntlOptimizer', () => {
  describe('#messages', () => {
    it('should perform a deep clone', () => {
      const messages = {
        en: { a: 'b' },
        fr: { c: 'd' },
      };

      const optimizer = new ReactIntlOptimizer({ messages });
      expect(optimizer.messages)
        .not.to.equal(messages);
      expect(optimizer.messages.en)
        .not.to.equal(messages.en);
      expect(optimizer.messages.fr)
        .not.to.equal(messages.fr);
      expect(optimizer.messages)
        .to.deep.equal(messages);
    });

    context('when languages option is present', () => {
      it('should filter out any un-matching language', () => {
        const messages = {
          en: { a: 'b' },
          pl: { c: 'd' },
          de: {},
        };

        const languages = ['de', 'pl'];

        const optimizer = new ReactIntlOptimizer({ messages, languages });
        expect(optimizer.messages)
          .to.deep.equal({
            pl: messages.pl,
            de: messages.de,
          });
      });

      it('should perform a shallow clone', () => {
        const messages = {
          en: { a: 'b' },
          pl: { c: 'd' },
          de: {},
        };
        const languages = ['de', 'pl'];

        const optimizer = new ReactIntlOptimizer({ messages, languages });
        expect(optimizer.messages.de)
          .not.to.equal(messages.de);
        expect(optimizer.messages.pl)
          .not.to.equal(messages.pl);
      });
    });
  });
});
