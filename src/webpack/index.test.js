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
  });
});
