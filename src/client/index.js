import Database from './db';

const database = new Database({
  name: 'react-intl-optimizer',
  storeName: 'languages',
  version: 1,
});

// eslint-disable-next-line no-underscore-dangle
export default async function (langKey, manifest = global.__REACT_INTL_OPTIMIZER__) {
  const data = manifest[langKey];
  if (data === void 0) {
    throw new TypeError(`manifest[${langKey}] is undefined`);
  }

  if (data.empty) {
    return {};
  }

  if (data.checksum !== undefined) {
    try {
      const { checksum, messages } = await database.getItem(langKey);
      if (checksum === data.checksum) {
        return messages;
      }
    } catch (ex) {} // eslint-disable-line no-empty
  }

  const res = await fetch(data.path);
  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const messages = await res.json();
  try {
    if (data.checksum !== undefined) {
      await database.setItem(langKey, data.checksum, messages);
    }
  } catch (ex) {} // eslint-disable-line no-empty

  return messages;
}
