function cleanData(data) {
  if (typeof data === 'string') {
    return data.replace(/\s+/g, ' ').trim();
  }
  return data;
}

module.exports = { cleanData };