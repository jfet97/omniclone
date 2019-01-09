const deepClone = require("./deepClone");
const errorObjectsHandler = require("./handlers/errorsObjectsHandler");
const regexpObjectsHandler = require("./handlers/regexpObjectsHanlder");
const arrayBufferObjectsHandler = require("./handlers/arrayBufferObjectsHandler");
const typedArraysObjectsHandler = require("./handlers/typedArraysObjectsHandler");
const dateObjectsHandler = require("./handlers/dateObjectsHandler");
const createDependenciesMap = require("./utility/createDependenciesMap");
const checkCircRef = require("./utility/dependenciesMapHandler");

function omniclone(
  obj = {},
  {
    setPrototype = false,
    invokeConstructors = true,
    copyNonEnumerables = false,
    copySymbols = false,
    copyGettersSetters = false,
    allowCircularReferences = true,
    discardErrorObjects = true
  } = {}
) {
  if (!obj || typeof obj !== "object") {
    throw new TypeError("TypeError: invalid 'obj' argument's type");
  }

  if (typeof setPrototype !== "boolean") {
    throw new TypeError("TypeError: invalid 'setPrototype' flag's type");
  }

  if (typeof invokeConstructors !== "boolean") {
    throw new TypeError("TypeError: invalid 'invokeConstructors' flag's type");
  }

  if (typeof copyNonEnumerables !== "boolean") {
    throw new TypeError("TypeError: invalid 'copyNonEnumerables' flag's type");
  }

  if (typeof copySymbols !== "boolean") {
    throw new TypeError("TypeError: invalid 'copySymbols' flag's type");
  }

  if (typeof copyGettersSetters !== "boolean") {
    throw new TypeError("TypeError: invalid 'copyGettersSetters' flag's type");
  }

  if (typeof allowCircularReferences !== "boolean") {
    throw new TypeError(
      "TypeError: invalid 'allowCircularReferences' flag's type"
    );
  }

  if (typeof discardErrorObjects !== "boolean") {
    throw new TypeError("TypeError: invalid 'discardErrorObjects' flag's type");
  }

  if (
    obj instanceof Number ||
    obj instanceof String ||
    obj instanceof Boolean
  ) {
    return null;
  }

  if (
    obj instanceof Promise ||
    obj instanceof WeakMap ||
    obj instanceof WeakSet
  ) {
    return obj;
  }

  if (obj instanceof Error) {
    return errorObjectsHandler(discardErrorObjects);
  }

  if (obj instanceof RegExp) {
    return regexpObjectsHandler(obj);
  }

  // Date objects are cloned mantaining the same Date
  if (obj instanceof Date) {
    return dateObjectsHandler(obj);
  }

  // deep copy of ArrayBuffer objects
  if (obj instanceof ArrayBuffer) {
    return arrayBufferObjectsHandler(obj);
  }

  // deep copy of TypedArray objects
  if (
    obj instanceof Int8Array ||
    obj instanceof Uint8Array ||
    obj instanceof Uint8ClampedArray ||
    obj instanceof Int16Array ||
    obj instanceof Uint16Array ||
    obj instanceof Int32Array ||
    obj instanceof Uint32Array ||
    obj instanceof Float32Array ||
    obj instanceof Float64Array
  ) {
    return typedArraysObjectsHandler(obj);
  }

  if (!allowCircularReferences) {
    // the internal algorithm is too semplicistic, it search only back references
    // so we have to force the allowCircularReferences if there are not
    const depsMap = createDependenciesMap(obj, copyNonEnumerables, copySymbols);
    // eslint-disable-next-line no-param-reassign
    if (checkCircRef(depsMap))
      throw new TypeError("TypeError: circular reference found");
  }

  const config = {
    setPrototype,
    invokeConstructors,
    copyNonEnumerables,
    copySymbols,
    copyGettersSetters,
    allowCircularReferences,
    discardErrorObjects
  };

  return deepClone(obj, config);
}

module.exports = omniclone;
