module.exports = (
  res,
  references,
  alreadyVisitedMap,
  recursiveInnerPropsUpdate
) => {
  Object.entries(res).forEach(([key, value]) => {
    // only if the value is an object
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
