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
      CallExpression(path, { file }) {
        const callee = path.get('callee');

        if (callee.referencesImport('react-intl', 'defineMessages')) {
          path.traverse(messagesObjectVisitor, { file });
          path.skip();
        }
      },

      ObjectExpression(path, { file }) {
        if (isValidMessagesShape(path)) {
          path.traverse(messagesObjectVisitor, { file });
        }
      },
    },
  };
}
