import * as crypto from 'crypto';

export function initialReviver(languages, defaultLanguage, optimization) {
  return (key, value) => {
    if (key === '') {
      return value;
    }

    switch (typeof value) {
      case 'object':
        if (key === defaultLanguage) {
          return value;
        }

        if (languages !== void 0 && !languages.includes(key)) {
          return void 0;
        }

        break;
      case 'string':
        if (optimization.removeValues !== void 0 && optimization.removeValues.includes(value)) {
          return void 0;
        }

        if (optimization.trimWhitespaces) {
          return value.trim();
        }

        break;
      default:
    }

    return value;
  };
}

export function createReplacer(whitelist, foundIds, trimWhitespaces) {
  return (key, value) => {
    if (key === '' || typeof value !== 'string') {
      return value;
    }

    if (foundIds === null || foundIds.has(key) || whitelist.includes(key)) {
      return trimWhitespaces
        ? value.trim()
        : value;
    }

    return undefined;
  };
}

export function renameMessageKeys(messages, idMap) {
  for (const [oldId, newId] of idMap.entries()) {
    if (oldId in messages) {
      const value = messages[oldId];
      delete messages[oldId];
      messages[newId] = value;
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
