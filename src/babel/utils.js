import fnv1a from '@sindresorhus/fnv1a';

export const fileMessages = new WeakMap();

const addMessage = (file, messageId, prevMessageId) => {
  if (fileMessages.has(file)) {
    fileMessages.get(file).push([messageId, prevMessageId]);
  } else {
    fileMessages.set(file, [[messageId, prevMessageId]]);
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
    if (path.get('key').isIdentifier({ name: 'id' })) {
      const valueNode = path.get('value').node;
      const { value } = valueNode;

      let actualId = value;

      if (this.opts.minifyIDs) {
        actualId = String(fnv1a(actualId));
        valueNode.value = actualId;
      }

      addMessage(this.file, actualId, value);
    }
  },
};
