module.exports = (references, value) => {
  if (references.has(value)) {
    // if I've previously found thid object value
    // I can return it because I've stored it in the references map
    return references.get(value); // is an object, that is always a truthy value
  }
  return null;
};
