function deepClone(source, config) {
  // circular references guard
  // each analized object will store its reference here
  // so we can check each of its object properties to see if there are
  // reference to already analized objects
  const references = new WeakMap();

  // A reference to the initial source object
  const start = source;

  function propsHandler(res, descriptors, config, references) {
    // sibiling safe references
    // if an object contains another object more than one times
    // storing its reference in more than one prop
    // we have to restore this state
    const safeReferences = new WeakMap();
    // obviously if the reference implies circular reference an error is thrown
    // if circular references are not supported

    // it will be called just after the definition
    function innerPropsHandler(
      res,
      descriptors,
      config,
      safeReferences,
      references
    ) {
      const {
        copyNonEnumerables,
        copySymbols,
        copyGettersSetters,
        allowCircularReferences,
        discardErrorObjects
      } = config;

      if (Array.isArray(descriptors)) {
        // we are dealing with map entries

        for (const [key, value] of descriptors) {
          if (value && typeof value === "object") {
            // check for duplicated sibiling object references
            // const duplicatedObj = {};
            // const map = {
            //      key: duplicatedObj
            //      anotherKey: duplicatedObj
            // }

            if (safeReferences.has(value)) {
              res.set(key, safeReferences.get(value));
              continue;
            }

            // check for circular references -
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
              if (discardErrorObjects) {
                continue;
              }
              throw new TypeError("TypeError: cannot copy Error objects");
            }

            // The Boolean, Number, and String objects are converted
            // to the corresponding primitive values
            if (value instanceof Number || value instanceof Boolean) {
              res.set(key, value.valueOf());
              continue;
            }

            if (value instanceof String) {
              res.set(key, value.toString());
              continue;
            }

            // Date prop objects are cloned mantaining the same Date
            if (value instanceof Date) {
              res.set(key, new Date(value.getTime()));

              // set the object reference to avoid sibiling duplicates
              safeReferences.set(value, res.get(key));
              continue;
            }

            // RegExp cloning is automatically supported
            if (value instanceof RegExp) {
              const { lastIndex } = value;
              const newValue = new RegExp(value.source, value.flags);
              newValue.lastIndex = lastIndex;
              res.set(key, newValue);

              // set the object reference to avoid sibiling duplicates
              safeReferences.set(value, res.get(key));
              continue;
            }

            // Promises are shallow cloned
            if (value instanceof Promise) {
              res.set(key, value);
              continue;
            }

            // WeakMaps are shallow cloned
            if (value instanceof WeakMap) {
              res.set(key, value);
              continue;
            }

            // WeakSets are shallow cloned
            if (value instanceof WeakSet) {
              res.set(key, value);
              continue;
            }

            // recursive deep copy for the others object props
            // eslint-disable-next-line no-use-before-define
            res.set(key, innerDeepClone(value, config, references, start));

            // set the object reference to avoid sibiling duplicates
            // value == reference to the current object / res[prop] == reference to the resulting copied object
            safeReferences.set(value, res.get(key));
          } else {
            // not an object (numeric values, functions, symbols)
            res.set(key, value);
          }
        }
      }

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
          // const duplicatedObj = {};
          // const source = {
          //      a: duplicatedObj
          //      b: duplicatedObj
          // }
          if (safeReferences.has(value)) {
            res[prop] = safeReferences.get(value);
            return;
          }

          // check for circular references -
          if (references.has(value)) {
            if (!allowCircularReferences) {
              throw new TypeError("TypeError: circular reference found");
            } else {
              // if circulary references are allowed
              // the temporary result is exactly the circ referred object
              // it could be an 'old' object
              // or an already copied object with or without
              // some 'old' circ references inside it
              res[prop] = references.get(value);
              return;
            }
          }

          // check discardErrorObjects flag to see how to handle Error objects
          if (value instanceof Error) {
            if (discardErrorObjects) {
              return;
            }
            throw new TypeError("TypeError: cannot copy Error objects");
          }

          // The Boolean, Number, and String objects are converted
          // to the corresponding primitive values
          if (value instanceof Number || value instanceof Boolean) {
            const newValue = descriptor.value.valueOf();
            Object.defineProperty(res, prop, {
              ...descriptor,
              ...{ value: newValue }
            });
            return;
          }

          if (value instanceof String) {
            const newValue = descriptor.value.toString();

            Object.defineProperty(res, prop, {
              ...descriptor,
              ...{ value: newValue }
            });
            return;
          }

          // Date prop objects are cloned mantaining the same Date
          if (value instanceof Date) {
            const newValue = new Date(descriptor.value.getTime());
            Object.defineProperty(res, prop, {
              ...descriptor,
              ...{ value: newValue }
            });

            // set the object reference to avoid sibiling duplicates
            safeReferences.set(value, res[prop]);

            return;
          }

          // RegExp cloning is automatically supported
          if (value instanceof RegExp) {
            const {
              value: { lastIndex }
            } = descriptor;

            const newValue = new RegExp(
              descriptor.value.source,
              descriptor.value.flags
            );

            Object.defineProperty(res, prop, {
              ...descriptor,
              ...{ value: newValue }
            });
            res[prop].lastIndex = lastIndex;

            // set the object reference to avoid sibiling duplicates
            safeReferences.set(value, res[prop]);

            return;
          }

          // Promises are shallow cloned
          if (value instanceof Promise) {
            Object.defineProperty(res, prop, descriptor);
            return;
          }

          // WeakMaps are shallow cloned
          if (value instanceof WeakMap) {
            Object.defineProperty(res, prop, descriptor);
            return;
          }

          // WeakSets are shallow cloned
          if (value instanceof WeakSet) {
            Object.defineProperty(res, prop, descriptor);
            return;
          }

          // recursive deep copy for the others object props
          // eslint-disable-next-line no-use-before-define
          res[prop] = innerDeepClone(value, config, references, start);

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
    }
    return innerPropsHandler(
      res,
      descriptors,
      config,
      safeReferences,
      references
    );
  }

  function updateReferences(res, references) {
    const alreadyVisited = new WeakMap();
    // we start from res, so it is already visited
    alreadyVisited.set(res);

    function innerUpdateReferences(res, references, alreadyVisited) {
      if (res instanceof Map) {
        // get the entries array
        const entries = [...res.entries()];

        for (const [key, value] of entries) {
          // only if the value is an object
          if (value && typeof value === "object") {
            // if the references map has a field corresponding to the current value
            // it means that the value is an old circ reference
            // but now the map has an up to date corresponding value (a new circ ref)
            // so we update the prop
            if (references.has(value)) {
              // is essential here that the value was
              // the reference to the old object
              res.set(key, references.get(value));
            } else {
              // if not, res[key] it is a new copied object that might
              // have some old circ references in it
              // vut it will be not visited if we have already
              // updated it
              if (alreadyVisited.has(value)) {
                continue;
              }
              alreadyVisited.set(value);
              innerUpdateReferences(value, references, alreadyVisited);
            }
          }
        }
      } else {
        Object.entries(res).forEach(([key, value]) => {
          // only if the value is an object
          if (value && typeof value === "object") {
            // if the references map has a field corresponding to the current value
            // it means that the value is an old circ reference
            // but now the map has an up to date corresponding value (a new circ ref)
            // so we update the prop
            if (references.has(value)) {
              // is essential here that the value was
              // the reference to the old object
              res[key] = references.get(value);
            } else {
              // if not, res[key] it is a new copied object that might
              // have some old circ references in it
              // vut it will be not visited if we have already
              // updated it
              if (alreadyVisited.has(value)) {
                return;
              }
              alreadyVisited.set(value);
              innerUpdateReferences(value, references, alreadyVisited);
            }
          }
        });
      }
    }

    return innerUpdateReferences(res, references, alreadyVisited);
  }

  function innerDeepClone(source, config, references, start) {
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
      const entries = [...source.entries()];

      // deep copy each entries from the source map to the map res
      propsHandler(res, entries, config, references);
    } else {
      // get all the property descriptors from the source object (ownPropsDcps is an object)
      const ownPropsDcps = Object.getOwnPropertyDescriptors(source);

      // deep copy each prop from the source object to the res object
      propsHandler(res, ownPropsDcps, config, references);
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
  }

  return innerDeepClone(source, config, references, start);
}

module.exports = deepClone;
