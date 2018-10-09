export function filterMessagesObj(messages, foundIDs) {
  for (const key of Object.keys(messages)) {
    if (!foundIDs.has(key)) {
      delete messages[key];
    }
  }

  return messages;
}
