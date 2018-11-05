import * as crypto from 'crypto';

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

function sortLanguages(messages) {
  const langauges = Object.entries(messages);
  langauges.sort(([, setA], [, setB]) => Object.values(setB).length - Object.values(setA).length);
  return langauges;
}

export function listDuplicates(messages) {
  const [firstLanguage, ...languages] = sortLanguages(messages);
  const duplicates = new Set();

  messages:
  for (const [id, value] of Object.entries(firstLanguage[1])) {
    for (const [, languageMessages] of languages) {
      const message = languageMessages[id];

      if (message === undefined || message !== value) {
        continue messages;
      }
    }

    duplicates.add(id);
  }

  return duplicates;
}


export function generateChecksum(str) {
  return crypto
    .createHash('md5')
    .update(str, 'utf8')
    .digest('hex');
}
