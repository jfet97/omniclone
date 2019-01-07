module.exports = (references, value, allowCircularReferencesFlag) => {
  if (references.has(value)) {
    if (!allowCircularReferencesFlag) {
      throw new TypeError("TypeError: circular reference found");
    } else {
      // if circulary references are allowed
      // the temporary result returned is exactly the circ referred object
      // it could be an 'old' object (map included)
      // or an already copied object with or without
      // some 'old' circ references inside it
      return references.get(value); // is an object, that is always a truthy value
    }
  } else {
    return null;
  }
};
