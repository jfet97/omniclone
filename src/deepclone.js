const updateReferences = require("./updateReferences");
const propsHandler = require("./propsHandler");

function deepClone(source, config) {
  // circular references guard
  // each analized object will store its reference here
  // so we can check each of its object properties to see if there are
  // reference to already analized objects
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

    // invokeConstructors flag indicates if the source constructor
    // must be invocated.
    if (invokeConstructors) {
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

    if (source instanceof Map) {
      // get the entries array
      const mapEntries = [...source.entries()];

      // deep copy each entries from the source map to the map res
      propsHandler(
        res,
        { mapEntries },
        config,
        start,
        references,
        innerDeepClone
      );
    } else if (source instanceof Set) {
      // get the values array
      const setEntries = [...source.values()];

      // deep copy each entries from the source map to the map res
      propsHandler(
        res,
        { setEntries },
        config,
        start,
        references,
        innerDeepClone
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
        innerDeepClone
      );
    }

    // circular references update from temp old values to new ones
    if (allowCircularReferences) {
      // each time an object is completed I update the references map
      // with its references. the object could still have some old circ ref
      // but I'll handle this later
      references.set(source, res);

      // if I've recurively handled all 'virtual' child
      // I've completely updated the references map
      // Now I have to recursively update all old circ refs to the new one
      if (start === source) {
        updateReferences(res, references);
      }
    }

    // return the result
    return res;
  })(source, config, references, start);
}

module.exports = deepClone;
