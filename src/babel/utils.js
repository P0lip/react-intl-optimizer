import { getActualId } from '../mangler/utils';
import { SUBSCRIBER_NAME } from '../consts';

export const fileMessages = new WeakMap();

const addMessage = (file, messageId) => {
  if (fileMessages.has(file)) {
    fileMessages.get(file).push(messageId);
  } else {
    fileMessages.set(file, [messageId]);
  }
};

export const isValidMessagesShape = (node) => {
  if (!node.isObjectExpression()) {
    return false;
  }

  for (const prop of node.get('properties')) {
    if (prop.isObjectExpression()) {
      if (isValidMessagesShape(prop)) {
        continue;
      }

      return false;
    }

    if (prop.isObjectProperty()) {
      if (prop.get('value.type').isObjectExpression() && isValidMessagesShape(prop.get('value'))) {
        continue;
      }

      if (prop.get('key').isIdentifier({ name: 'defaultMessage' })) {
        continue;
      }

      if (prop.get('key').isIdentifier({ name: 'id' }) && prop.get('value').isStringLiteral()) {
        continue;
      }

      return false;
    }

    return false;
  }

  return true;
};

export const messagesObjectVisitor = {
  ObjectProperty(path) {
    const { mangleMap = null } = global[SUBSCRIBER_NAME] || {};

    if (path.get('key').isIdentifier({ name: 'id' })) {
      const valueNode = path.get('value').node;
      const { value } = valueNode;
      const actualId = getActualId(mangleMap, value);

      if (actualId !== value) {
        valueNode.value = actualId;
      }

      addMessage(this.file, actualId);
    }
  },
};
