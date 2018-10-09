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

      if (prop.get('key').node.name === 'defaultMessage') {
        continue;
      }

      if (prop.get('key').node.name === 'id' && prop.get('value').isStringLiteral() && typeof prop.get('value').node.value === 'string') {
        continue;
      }

      return false;
    }

    return false;
  }

  return true;
};

export function getMessages(node, messages = []) {
  for (const prop of node.get('properties')) {
    if (prop.isObjectExpression()) {
      getMessages(prop, messages);
    } else if (prop.isObjectProperty()) {
      if (prop.isObjectExpression()) {
        getMessages(prop.get('value'), messages);
      } else if (prop.get('key').node.name === 'id') {
        messages.push(String(prop.get('value').node.value));
      }
    }
  }

  return messages;
}
