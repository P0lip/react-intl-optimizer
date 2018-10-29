import fnv1a from '@sindresorhus/fnv1a';

export function isDuplicatedID(languages, values, id) {
  for (const [i, [, languageMessages]] of languages.entries()) {
    const message = languageMessages[id];

    if (message !== values[i + 1]) {
      return false;
    }
  }

  return true;
}

const getIDs = (languages, id) => languages.map(([, languageMessages]) => languageMessages[id]);

export class IdMap extends Map {
  constructor(messages, baseLanguage, optimization) {
    super();

    this.baseMessages = messages[baseLanguage];
    this.messages = Object.entries(messages).filter(([key]) => key !== baseLanguage);
    this.optimization = optimization;
    this.whitelist = optimization.whitelist;

    this.duplicatedIDs = this.optimization.mergeDuplicates ? {} : null;
  }

  minify(id) {
    if (this.optimization.minifyIDs) {
      return String(fnv1a(id));
    }

    return id;
  }

  // todo: rename to getId, add getDefaultMessage
  get(id) {
    id = String(id);

    const foundId = super.get(id);
    if (foundId !== undefined) {
      return foundId;
    }

    if (this.baseMessages === undefined) {
      return id;
    }

    const value = this.baseMessages[id];

    if (value === undefined || (this.whitelist !== undefined && this.whitelist.includes(id))) {
      return id;
    }

    let newId = id;

    if (this.optimization.mergeDuplicates) {
      if (!(value in this.duplicatedIDs)) {
        this.duplicatedIDs[value] = [id, ...getIDs(this.messages, id)];
      } else if (isDuplicatedID(this.messages, this.duplicatedIDs[value], id)) {
        [newId] = this.duplicatedIDs[value];
        [id] = this.duplicatedIDs[value];
      }
    }

    newId = this.minify(id);

    this.set(id, newId);

    return newId;
  }
}
