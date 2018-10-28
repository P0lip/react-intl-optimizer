import {
  isValidMessagesShape,
  fileMessages,
  messagesVisitor,
} from './utils';
import { METADATA_NAME } from '../consts';

export default function ({ types: t }) {
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

        if (callee.node.name === 'defineMessages') {
          path.get('arguments.0').traverse(messagesVisitor, { file, opts, t });
          path.stop();
        }
      },

      ObjectExpression(path, { file, opts }) {
        if (isValidMessagesShape(path)) {
          path.parentPath.traverse(messagesVisitor, { file, opts, t });
          path.stop();
        }
      },
    },
  };
}
