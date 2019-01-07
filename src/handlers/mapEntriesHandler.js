const errorObjectsHandler = require("./errorsObjectsHandlers");
const regexpObjectsHandler = require("./regexpObjectsHanlder");
const dateObjectsHandler = require("./dateObjectsHandler");
const primitiveObjectsHandler = require("./primitiveObjectsHandler");
const circReferencesHelper = require("./../utility/circReferencesHelper");
const safeReferencesHelper = require("./../utility/safeReferencesHelper");

module.exports = (
  res,
  data,
  config,
  start,
  safeReferences,
  references,
  recursiveDeepCloning
) => {
  const mapEntries = data;

  const { allowCircularReferences, discardErrorObjects } = config;

  for (const [key, value] of mapEntries) {
    if (value && typeof value === "object") {
      // check for duplicated sibiling object references
      const safeReference = safeReferencesHelper(safeReferences, value);
      if (safeReference) {
        res.set(key, safeReference);
        continue;
      }

      // check for circular references
      const circRef = circReferencesHelper(
        references,
        value,
        allowCircularReferences
      );
      if (circRef) {
        res.set(key, circRef);
        continue;
      }

      if (references.has(value)) {
        if (!allowCircularReferences) {
          throw new TypeError("TypeError: circular reference found");
        } else {
          // if circulary references are allowed
          // the temporary result is exactly the circ referred object
          // it could be an 'old' object (map included)
          // or an already copied object with or without
          // some 'old' circ references inside it
          res.set(key, references.get(value));
          continue;
        }
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
        res.set(key, primitiveObjectsHandler(value));
        continue;
      }

      // Date prop objects are cloned mantaining the same Date
      if (value instanceof Date) {
        const newDate = dateObjectsHandler(value);

        res.set(key, newDate);

        // set the object reference to avoid sibiling duplicates
        safeReferences.set(value, newDate);
        continue;
      }

      // RegExp cloning is automatically supported
      if (value instanceof RegExp) {
        const clonedRegexp = regexpObjectsHandler(value);
        res.set(key, clonedRegexp);

        // set the object reference to avoid sibiling duplicates
        safeReferences.set(value, clonedRegexp);
        continue;
      }

      // Promises are cloned by reference
      if (value instanceof Promise) {
        res.set(key, value);
        continue;
      }

      // WeakMaps are cloned by reference
      if (value instanceof WeakMap) {
        res.set(key, value);
        continue;
      }

      // WeakSets are cloned by reference
      if (value instanceof WeakSet) {
        res.set(key, value);
        continue;
      }

      // recursive deep copy for the others object props
      // eslint-disable-next-line no-use-before-define
      res.set(key, recursiveDeepCloning(value, config, references, start));

      // set the object reference to avoid sibiling duplicates
      // value == reference to the current object / res[prop] == reference to the resulting copied object
      safeReferences.set(value, res.get(key));
    } else {
      // not an object (numeric values, functions, symbols)
      res.set(key, value);
    }
  }
};
