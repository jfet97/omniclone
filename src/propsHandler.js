const mapEntriesHandler = require("./handlers/mapEntriesHandler");
const setEntriesHandler = require("./handlers/setEntriesHandler");
const otherObjectsDescriptorsHandler = require("./handlers/otherObjectsDescriptorsHandler");

module.exports = function propsHandler(
  res,
  data,
  config,
  start,
  references,
  deepClone
) {
  // sibiling safe references
  // if an object contains another object more than one times
  // storing its reference in more than one prop
  // we have to restore this state
  const safeReferences = new WeakMap();
  // obviously if the reference implies circular reference an error is thrown
  // if circular references are not supported

  return (function innerPropsHandler(
    res,
    data,
    config,
    safeReferences,
    references
  ) {
    const { mapEntries, setEntries, ownPropsDcps: descriptors } = data;

    if (mapEntries) {
      // we are dealing with map entries
      return mapEntriesHandler(
        res,
        mapEntries,
        config,
        start,
        safeReferences,
        references,
        // eslint-disable-next-line no-use-before-define
        deepClone
      );
    }

    if (setEntries) {
      // we are dealing with set entries
      return setEntriesHandler(
        res,
        setEntries,
        config,
        start,
        references,
        // eslint-disable-next-line no-use-before-define
        deepClone
      );
    }

    if (descriptors) {
      return otherObjectsDescriptorsHandler(
        res,
        descriptors,
        config,
        start,
        safeReferences,
        references,
        // eslint-disable-next-line no-use-before-define
        deepClone
      );
    }

    throw new Error("wrong data parameter for innerPropsHandler function");
  })(res, data, config, safeReferences, references);
};
