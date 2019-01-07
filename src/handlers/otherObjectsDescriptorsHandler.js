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
  const descriptors = data;

  const {
    copyNonEnumerables,
    copySymbols,
    copyGettersSetters,
    allowCircularReferences,
    discardErrorObjects
  } = config;

  Object.entries(descriptors).forEach(([prop, descriptor]) => {
    const { value, enumerable } = descriptor;

    // the copyNonEnumerables setted to true indicates that
    // we can copy non enumerable props
    // if we mustn't copy non enumerables and the current prop is no enumerable we return
    if (!copyNonEnumerables && !enumerable) return;

    // the copySymbols setted to true indicates that
    // we can copy symbol props
    // if we mustn't copy symbols and the current prop is a symbol we return
    if (!copySymbols && typeof value === "symbol") return;

    // copyGettersSetters setted to true indicates that
    // we can copy getters and setters
    // if we mustn't copy g||s and the current prop has g||s we return

    if (!copyGettersSetters && (descriptor.get || descriptor.set)) return;

    if (value && typeof value === "object") {
      // check for duplicated sibiling object references
      const safeReference = safeReferencesHelper(safeReferences, value);
      if (safeReference) {
        res[prop] = safeReference;
        return;
      }

      // check for circular references -
      const circRef = circReferencesHelper(
        references,
        value,
        allowCircularReferences
      );
      if (circRef) {
        res[prop] = circRef;
        return;
      }

      // check discardErrorObjects flag to see how to handle Error objects
      if (value instanceof Error) {
        errorObjectsHandler(discardErrorObjects);
        return;
      }

      // The Boolean, Number, and String objects are converted
      // to the corresponding primitive values
      if (
        value instanceof Number ||
        value instanceof Boolean ||
        value instanceof String
      ) {
        const primitiveValue = primitiveObjectsHandler(value);
        Object.defineProperty(res, prop, {
          ...descriptor,
          ...{ value: primitiveValue }
        });
        return;
      }

      // Date prop objects are cloned mantaining the same Date
      if (value instanceof Date) {
        const newDate = dateObjectsHandler(value);

        Object.defineProperty(res, prop, {
          ...descriptor,
          ...{ value: newDate }
        });

        // set the object reference to avoid sibiling duplicates
        safeReferences.set(value, newDate);

        return;
      }

      // RegExp cloning is automatically supported
      if (value instanceof RegExp) {
        const clonedRegexp = regexpObjectsHandler(value);

        Object.defineProperty(res, prop, {
          ...descriptor,
          ...{ value: clonedRegexp }
        });

        // set the object reference to avoid sibiling duplicates
        safeReferences.set(value, clonedRegexp);

        return;
      }

      // Promises are cloned by reference
      if (value instanceof Promise) {
        Object.defineProperty(res, prop, descriptor);
        return;
      }

      // WeakMaps are cloned by reference
      if (value instanceof WeakMap) {
        Object.defineProperty(res, prop, descriptor);
        return;
      }

      // WeakSets are cloned by reference
      if (value instanceof WeakSet) {
        Object.defineProperty(res, prop, descriptor);
        return;
      }

      // recursive deep copy for the others object props
      // eslint-disable-next-line no-use-before-define
      res[prop] = recursiveDeepCloning(value, config, references, start);

      // set the object reference to avoid sibiling duplicates
      // value == reference to the current object / res[prop] == reference to the resulting copied object
      safeReferences.set(value, res[prop]);
    } else {
      const propDesc = Object.getOwnPropertyDescriptor(res, prop);
      if (!propDesc || propDesc.configurable) {
        // shallow copy for others props only if the previously invoked constructor has not already insert
        // a corresponding non config prop
        Object.defineProperty(res, prop, descriptor);
      }
    }
  });
};
