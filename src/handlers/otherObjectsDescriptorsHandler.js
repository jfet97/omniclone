const errorObjectsHandler = require("./errorsObjectsHandler");
const regexpObjectsHandler = require("./regexpObjectsHanlder");
const dateObjectsHandler = require("./dateObjectsHandler");
const arrayBufferObjectsHandler = require("./arrayBufferObjectsHandler");
const typedArraysObjectsHandler = require("./typedArraysObjectsHandler");
const primitiveObjectsHandler = require("./primitiveObjectsHandler");
const prevReferencesHelper = require("./../utility/prevReferencesHelper");

module.exports = (
  res,
  data,
  config,
  start,
  references,
  recursiveDeepCloning
) => {
  const descriptors = data;

  const {
    copyNonEnumerables,
    copySymbols,
    copyGettersSetters,
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
    if (!copySymbols && typeof prop === "symbol") return;

    // copyGettersSetters setted to true indicates that
    // we can copy getters and setters
    // if we mustn't copy g||s and the current prop has g||s we return

    if (!copyGettersSetters && (descriptor.get || descriptor.set)) return;

    if (value && typeof value === "object") {
      // check if I've already found this object
      const prevRef = prevReferencesHelper(references, value);
      if (prevRef) {
        res[prop] = prevRef;
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

        // set the object reference to speedup in case of duplicates
        references.set(value, newDate);

        return;
      }

      // RegExp cloning is automatically supported
      if (value instanceof RegExp) {
        const clonedRegexp = regexpObjectsHandler(value);

        Object.defineProperty(res, prop, {
          ...descriptor,
          ...{ value: clonedRegexp }
        });

        // set the object reference to speedup in case of duplicates
        references.set(value, clonedRegexp);

        return;
      }

      // Promises are cloned by reference
      if (value instanceof Promise) {
        Object.defineProperty(res, prop, descriptor);
        return;
      }

      // deep copy of ArrayBuffer objects
      if (value instanceof ArrayBuffer) {
        const clonedArrayBuffer = arrayBufferObjectsHandler(value);

        Object.defineProperty(res, prop, {
          ...descriptor,
          ...{ value: clonedArrayBuffer }
        });

        // set the object reference to speedup in case of duplicates
        references.set(value, clonedArrayBuffer);

        return;
      }

      // deep copy of TypedArray objects
      if (
        value instanceof Int8Array ||
        value instanceof Uint8Array ||
        value instanceof Uint8ClampedArray ||
        value instanceof Int16Array ||
        value instanceof Uint16Array ||
        value instanceof Int32Array ||
        value instanceof Uint32Array ||
        value instanceof Float32Array ||
        value instanceof Float64Array
      ) {
        const clonedTypedArray = typedArraysObjectsHandler(value);

        Object.defineProperty(res, prop, {
          ...descriptor,
          ...{ value: clonedTypedArray }
        });

        // set the object reference to speedup in case of duplicates
        references.set(value, clonedTypedArray);
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
