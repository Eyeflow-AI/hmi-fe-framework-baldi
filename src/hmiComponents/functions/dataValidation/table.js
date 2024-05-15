function table({ obj }) {
  if (!obj || !Array.isArray(obj)) {
    return [];
  }
  return obj;
}

export default table;
