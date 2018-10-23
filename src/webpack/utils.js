export function createReplacer(whitelist, foundIds) {
  return (key, value) => {
    if (key === '' || foundIds === null || foundIds.has(key) || whitelist.includes(key)) {
      return value;
    }

    return undefined;
  };
}

export function mangleMessagesObj(messages, mangleMap) {
  for (const [key, value] of Object.entries(messages)) {
    if (mangleMap.has(key)) {
      delete messages[key];
      messages[mangleMap.get(key)] = value;
    }
  }

  return messages;
}
