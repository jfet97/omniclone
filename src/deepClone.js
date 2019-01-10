const updateReferences = require("./updateReferences");
const propsHandler = require("./propsHandler");

function deepClone(source, config, customHandler) {
  // already visited references map
  // each analized object will store its reference here
  // so we can check each of its chilren object to see if there are
  // references to already analized objects
  const references = new WeakMap();

  // A reference to the initial source object
  const start = source;

  return (function innerDeepClone(source, config, references, start) {
    const {
      setPrototype,
      invokeConstructors,
      allowCircularReferences
    } = config;

    // set a reference for the current obj into the guard
    // the value stored does not matter if the allowCircularReferences is not enabled
    // is the reference the fulcrum of the control in this case
    // otherwise it's essential for the final circ references update
    references.set(source, source);

    // result value
    let res = null;

    if (invokeConstructors) {
      // invokeConstructors flag indicates if the source constructor
      // must be invocated.
      res = new source.constructor();
      // if so, the [[Prototype]] prop is set to constructor.protoype
      // so it could be different from the source [[Prototype]]
    } else if (setPrototype) {
      // if not, we have to choose what to do with the [[Prototype]] prop
      // setPrototype flag indicates if we have to set up the same [[Prototype]] prop
      // as the source object or not
      // so the constructor property will be setted like in the previous case
      // but without invoking the constructor
      res = Object.create(Object.getPrototypeOf(source));
    } else {
      res = {};
    }

    // special case: Array
    // to properly create arrays even when invokeConstructors flag is false
    // and/or when setPrototype flag is false too
    if (source instanceof Array) {
      res = [];
    }

    if (source instanceof Map) {
      // special case: Map
      // to properly create maps even when invokeConstructors flag is false
      // and/or when setPrototype flag is false too
      res = new Map();

      // get the entries array
      const mapEntries = [...source.entries()];

      // deep copy each entries from the source map to the map res
      propsHandler(
        res,
        { mapEntries },
        config,
        start,
        references,
        innerDeepClone,
        customHandler
      );
    } else if (source instanceof Set) {
      // special case: Set
      // to properly create sets even when invokeConstructors flag is false
      // and/or when setPrototype flag is false too
      res = new Set();

      // get the values array
      const setEntries = [...source.values()];

      // deep copy each entries from the source map to the map res
      propsHandler(
        res,
        { setEntries },
        config,
        start,
        references,
        innerDeepClone,
        customHandler
      );
    } else {
      // get all the property descriptors from the source object (ownPropsDcps is an object)
      const ownPropsDcps = Object.getOwnPropertyDescriptors(source);

      // deep copy each prop from the source object to the res object
      propsHandler(
        res,
        { ownPropsDcps },
        config,
        start,
        references,
        innerDeepClone,
        customHandler
      );
    }

    // each time an object is cloned I update the references map
    // with its new reference. The object could still have some old circ refs
    // but I'll handle this later
    references.set(source, res);

    // circular references update from temp old values to new ones
    // we don't it if allowCircularReferences is false because the previous check
    // in omniclone.js would have trown an error
    if (allowCircularReferences) {
      if (start === source) {
        // if I've recursively handled all 'virtual' children
        // I've completely updated the references map
        // Now I have to recursively update all old circ refs to the new ones
        updateReferences(res, references);
      }
    }

    // return the result
    return res;
  })(source, config, references, start);
}

module.exports = deepClone;
