const errorObjectsHandler = require("./errorsObjectsHandler");
const regexpObjectsHandler = require("./regexpObjectsHanlder");
const dateObjectsHandler = require("./dateObjectsHandler");
const primitiveObjectsHandler = require("./primitiveObjectsHandler");
const typedArraysObjectsHandler = require("./typedArraysObjectsHandler");
const prevReferencesHelper = require("./../utility/prevReferencesHelper");
const arrayBufferObjectsHandler = require("./arrayBufferObjectsHandler");

module.exports = (
  res,
  data,
  config,
  start,
  references,
  recursiveDeepCloning,
  customHandler
) => {
  const setEntries = data;

  const { discardErrorObjects } = config;

  // for set key == value

  for (const value of setEntries) {
    if (value && typeof value === "object") {
      // check if I've already found this object
      const prevRef = prevReferencesHelper(references, value);
      if (prevRef) {
        res.add(prevRef);
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

        // set the object reference to speedup in case of duplicates somewhere else
        references.set(value, newDate);

        continue;
      }

      // RegExp cloning is automatically supported
      if (value instanceof RegExp) {
        const clonedRegexp = regexpObjectsHandler(value);
        res.add(clonedRegexp);

        // set the object reference to speedup in case of duplicates somewhere else
        references.set(value, clonedRegexp);

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

      if (value instanceof Map || value instanceof Set) {
        res.add(recursiveDeepCloning(value, config, references, start));
        continue;
      }

      // the custom Handler has more priority than ArrayBuffer and TypedArray and DataView objects but less tham Maps and Sets

      // custom Handler
      const customHandlerReturnValue = customHandler(value, { ...config });
      if (customHandlerReturnValue !== undefined) {
        res.add(customHandlerReturnValue);
        // set the object reference to speedup in case of duplicates somewhere else
        references.set(value, customHandlerReturnValue);
        continue;
      }

      // copy by reference for DataView objects
      if (value instanceof DataView) {
        res.add(value);
        continue;
      }

      // deep copy of ArrayBuffer objects
      if (value instanceof ArrayBuffer) {
        const clonedArrayBuffer = arrayBufferObjectsHandler(value);

        res.add(clonedArrayBuffer);

        // set the object reference to speedup in case of duplicates somewhere else
        references.set(value, clonedArrayBuffer);
        continue;
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

        res.add(clonedTypedArray);

        // set the object reference to speedup in case of duplicates
        references.set(value, clonedTypedArray);
        continue;
      }

      // recursive deep copy for the others object props
      res.add(recursiveDeepCloning(value, config, references, start));
    } else {
      // not an object (numeric values, functions, symbols)
      res.add(value);
    }
  }
};
