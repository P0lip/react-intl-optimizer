import { isValidMessagesShape, getMessages } from './utils';

const MESSAGES = Symbol('ReactIntlMessages');

// eslint-disable-next-line no-unused-vars
export default function ({ types: t }) {
  return {
    post(file) {
      file.metadata['react-intl'] = file[MESSAGES];
    },

    visitor: {
      ObjectExpression(path, state) {
        if (isValidMessagesShape(path)) {
          if (state.file[MESSAGES] !== undefined) {
            state.file[MESSAGES].push(...getMessages(path));
          } else {
            state.file[MESSAGES] = getMessages(path);
          }
        }
      },
    },
  };
}
