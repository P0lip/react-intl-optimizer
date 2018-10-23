
export function getActualId(mangleMap, id) {
  if (mangleMap === null) return id;

  return mangleMap.get(id);
}
