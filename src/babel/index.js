import {
  isValidMessagesShape,
  messagesObjectVisitor,
  fileMessages,
} from './utils';
import { METADATA_NAME } from '../consts';

export default function () {
  return {
    post(file) {
      const messages = fileMessages.get(file);

      if (messages !== undefined) {
        file.metadata[METADATA_NAME] = messages;
      }
    },

    visitor: {
      CallExpression(path, { file, opts }) {
        const callee = path.get('callee');

        if (callee.referencesImport('react-intl', 'defineMessages')) {
          path.traverse(messagesObjectVisitor, { file, opts });
          path.skip();
        }
      },

      ObjectExpression(path, { file, opts }) {
        if (isValidMessagesShape(path)) {
          path.traverse(messagesObjectVisitor, { file, opts });
        }
      },
    },
  };
}
