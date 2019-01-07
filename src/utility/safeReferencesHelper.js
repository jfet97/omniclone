module.exports = (safeReferences, value) =>
  safeReferences.has(value) ? safeReferences.get(value) : null;

// const duplicatedObj = {};
// const map = {
//      key: duplicatedObj
//      anotherKey: duplicatedObj
// }

// if there is a safeReference, it would be an object and also emtpy objects are truthy values
