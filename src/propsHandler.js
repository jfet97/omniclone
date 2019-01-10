const mapEntriesHandler = require("./handlers/mapEntriesHandler");
const setEntriesHandler = require("./handlers/setEntriesHandler");
const otherObjectsDescriptorsHandler = require("./handlers/otherObjectsDescriptorsHandler");

module.exports = function propsHandler(
  res,
  data,
  config,
  start,
  references,
  deepClone,
  customHandler
) {

  return (function innerPropsHandler(res, data, config, references) {
    const { mapEntries, setEntries, ownPropsDcps: descriptors } = data;

    if (mapEntries) {
      // we are dealing with map entries
      return mapEntriesHandler(
        res,
        mapEntries,
        config,
        start,
        references,
        // eslint-disable-next-line no-use-before-define
        deepClone,
        customHandler
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
        deepClone,
        customHandler
      );
    }

    if (descriptors) {
      return otherObjectsDescriptorsHandler(
        res,
        descriptors,
        config,
        start,
        references,
        // eslint-disable-next-line no-use-before-define
        deepClone,
        customHandler
      );
    }

    throw new Error("wrong data parameter for innerPropsHandler function");
  })(res, data, config, references);
};
