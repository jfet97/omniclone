const errorObjectsHandler = require("./errorsObjectsHandlers");
const regexpObjectsHandler = require("./regexpObjectsHanlder");
const dateObjectsHandler = require("./dateObjectsHandler");
const primitiveObjectsHandler = require("./primitiveObjectsHandler");
const circReferencesHelper = require("./../utility/circReferencesHelper");

module.exports = (
  res,
  data,
  config,
  start,
  references,
  recursiveDeepCloning
) => {
  const setEntries = data;

  const { allowCircularReferences, discardErrorObjects } = config;

  // for set key == value

  for (const value of setEntries) {
    if (value && typeof value === "object") {
      // check for circular references
      const circRef = circReferencesHelper(
        references,
        value,
        allowCircularReferences
      );
      if (circRef) {
        res.add(circRef);
        continue;
      }

      // check discardErrorObjects flag to see how to handle Error objects
      if (value instanceof Error) {
        errorObjectsHandler(discardErrorObjects);
        continue;
      }

      // The Boolean, Number, and String objects are converted
      // to the corresponding primitive values
      if (
        value instanceof Number ||
        value instanceof Boolean ||
        value instanceof String
      ) {
        res.add(primitiveObjectsHandler(value));
        continue;
      }

      // Date prop objects are cloned mantaining the same Date
      if (value instanceof Date) {
        const newDate = dateObjectsHandler(value);
        res.add(newDate);
        continue;
      }

      // RegExp cloning is automatically supported
      if (value instanceof RegExp) {
        const clonedRegexp = regexpObjectsHandler(value);
        res.add(clonedRegexp);
        continue;
      }

      // Promises are cloned by reference
      if (value instanceof Promise) {
        res.add(value);
        continue;
      }

      // WeakMaps are cloned by reference
      if (value instanceof WeakMap) {
        res.add(value);
        continue;
      }

      // WeakSets are cloned by reference
      if (value instanceof WeakSet) {
        res.add(value);
        continue;
      }

      // recursive deep copy for the others object props
      // eslint-disable-next-line no-use-before-define
      const deepClonedValue = recursiveDeepCloning(
        value,
        config,
        references,
        start
      );
      res.add(deepClonedValue);
    } else {
      // not an object (numeric values, functions, symbols)
      res.add(value);
    }
  }
};
