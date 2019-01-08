module.exports = (
  res,
  references,
  alreadyVisitedMap,
  recursiveInnerPropsUpdate
) => {
  // we have to update alle the references in the res object (non-enum and symbol prop included)
  // if non-enum and symbol prop had to be discarded won't be present at all in the res object, so no checks to do

  // we discard non object, function and setters&getters

  const descriptors = Object.getOwnPropertyDescriptors(res);

  Object.entries(descriptors).forEach(([key, descriptor]) => {
    // descriptor.value == value of each prop == potential reference to a node

    if (descriptor.set || descriptor.get) {
      // don't care about getters and setters
      // them are functions that will be copied by reference
      return;
    }

    const { value } = descriptor;

    // discard functions and non object
    if (value && typeof value === "object") {
      // if the references map has a field corresponding to the current value
      // it means that the value is an old circ reference
      // but now the map has an up to date corresponding value (a new circ ref)
      // so we update the prop
      if (references.has(value)) {
        // is essential here that the value was
        // the reference to the old object
        res[key] = references.get(value);
      } else {
        // if not, res[key] it is a new copied object that might
        // have some old circ references in it
        // vut it will be not visited if we have already
        // updated it
        if (alreadyVisitedMap.has(value)) {
          return;
        }
        alreadyVisitedMap.set(value);
        recursiveInnerPropsUpdate(value, references, alreadyVisitedMap);
      }
    }
  });
};
