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

const minify = (node) => {
  const newId = String(fnv1a(node.value));
  node.value = newId;

  return newId;
};

function getID(path) {
  return path.node.value;
}

function processIdPath(path, { opts: { minifyIDs, whitelist }, file }) {
  const initialId = getID(path);
  let actualId = initialId;

  if (minifyIDs && !whitelist.includes(actualId)) {
    actualId = minify(path.node);
  }

  addMessage(file, actualId, initialId);
}

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
      },
    } = this;

    const properties = path.get('properties');

    const idNode = properties.find(prop => prop.get('key').isIdentifier({ name: 'id' }));
    if (idNode) {
      const idNodeValue = idNode.get('value');
      const id = getID(idNodeValue);

      if (inlineDefaultLanguage && id in messages) {
        inlineMessage(path, this, messages[id]);
      }

      processIdPath(idNodeValue, this);
      path.stop();
    }
  },
};
