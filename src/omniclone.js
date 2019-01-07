const deepClone = require("./deepClone");
const errorObjectsHandler = require("./handlers/errorsObjectsHandler");
const regexpObjectsHandler = require("./handlers/regexpObjectsHanlder");
const dateObjectsHandler = require("./handlers/dateObjectsHandler");

function omniclone(
  obj = {},
  {
    setPrototype = false,
    invokeConstructors = true,
    copyNonEnumerables = false,
    copySymbols = false,
    copyGettersSetters = false,
    allowCircularReferences = false,
    discardErrorObjects = true
  } = {}
) {
  if (!obj || typeof obj !== "object") {
    throw new TypeError("TypeError: invalid 'obj' argument's type");
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
