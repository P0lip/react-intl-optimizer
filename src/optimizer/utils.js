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

      const key = prop.get('key');

      if (key.isIdentifier({ name: 'defaultMessage' }) || key.isIdentifier({ name: 'description' })) {
        continue;
      }

      if (key.isIdentifier({ name: 'id' }) && prop.get('value').isStringLiteral()) {
        continue;
      }

      return false;
    }

    return false;
  }

  return true;
};

const getID = path => path.node.value;

function inlineMessage(path, { t }, message) {
  const defaultMessageNode = path
    .get('properties')
    .find(prop => prop.get('key').isIdentifier({ name: 'defaultMessage' }));

  const newMessageNode = t.objectProperty(
    t.stringLiteral('defaultMessage'),
    t.stringLiteral(message),
  );

  if (defaultMessageNode) {
    defaultMessageNode.replaceWith(newMessageNode);
  } else {
    path.pushContainer(
      'properties',
      newMessageNode,
    );
  }
}

export const messagesVisitor = {
  ObjectExpression(path) {
    const {
      opts: {
        inlineDefaultLanguage,
        messages,
        idMap,
      },
    } = this;

    const properties = path.get('properties');

    const idNode = properties.find(prop => prop.get('key').isIdentifier({ name: 'id' }));
    if (idNode) {
      const idNodeValue = idNode.get('value');
      const initialId = getID(idNodeValue);
      const newId = idMap.get(initialId);

      // todo: shall we respect whitelist here?
      if (inlineDefaultLanguage && initialId in messages) {
        inlineMessage(path, this, messages[initialId]);
      }

      if (initialId !== newId) {
        idNodeValue.node.value = newId;
      }

      addMessage(this.file, newId, initialId);
      path.stop();
    }
  },
};
