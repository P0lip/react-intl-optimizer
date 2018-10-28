export function createReplacer(whitelist, foundIds) {
  return (key, value) => {
    if (key === '' || foundIds === null || foundIds.has(key) || whitelist.includes(key)) {
      return value;
    }

    return undefined;
  };
}

export function renameMessageKeys(messages, idMap) {
  for (const [id, prevId] of idMap.entries()) {
    if (prevId in messages) {
      const value = messages[prevId];
      delete messages[prevId];
      messages[id] = value;
    }
  }
}
