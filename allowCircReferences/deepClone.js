function deepClone(obj = {}, {
    setPrototype = false,
    invokeConstructors = true,
    copyNonEnumerables = false,
    copySymbols = false,
    copyGettersSetters = false,
    allowCircularReferences = false,
} = {}) {

    if (!obj || typeof obj != 'object') {
        throw new TypeError(`TypeError: invalid 'obj' argument's type`);
    }

    const config = {
        setPrototype,
        invokeConstructors,
        copyNonEnumerables,
        copySymbols,
        copyGettersSetters,
        allowCircularReferences,
    };

    if (typeof setPrototype != 'boolean') {
        throw new TypeError(`TypeError: invalid 'setPrototype' flag's type`);
    }

    if (typeof invokeConstructors != 'boolean') {
        throw new TypeError(`TypeError: invalid 'invokeConstructors' flag's type`);
    }

    if (typeof copyNonEnumerables != 'boolean') {
        throw new TypeError(`TypeError: invalid 'copyNonEnumerables' flag's type`);
    }

    if (typeof copySymbols != 'boolean') {
        throw new TypeError(`TypeError: invalid 'copySymbols' flag's type`);
    }

    if (typeof copyGettersSetters != 'boolean') {
        throw new TypeError(`TypeError: invalid 'copyGettersSetters' flag's type`);
    }
    if (typeof allowCircularReferences != 'boolean') {
        throw new TypeError(`TypeError: invalid 'allowCircularReferences' flag's type`);
    }

    // circular references guard
    // each analized object will store its reference here
    // so we can check each of its object properties to see if there are
    // reference to already analized objects
    const references = new WeakMap;

    // A reference to the parent object
    const start = obj;

    return (function realDeepCopy(source, {
        setPrototype,
        invokeConstructors,
        copyNonEnumerables,
        copySymbols,
        copyGettersSetters,
        allowCircularReferences,
    }, references, start) {

        // set a reference for the current obj into the guard
        // the value stored does not matter if the allowCircularReferences is not enabled
        // is the reference the fulcrum of the control in this case
        // otherwise it's essential for the final circ references update
        references.set(source, source);

        // result value
        let res = null;

        // get all the property descriptors from the source object
        const ownPropsDcps = Object.getOwnPropertyDescriptors(source);

        // invokeConstructors flag indicates if the source constructor
        // must be invocated.
        if (invokeConstructors) {
            res = new source.constructor();
            // if so, the [[Prototype]] prop is already set up
        } else {
            // if not, we have to choose what to do with the [[Prototype]] prop
            // setPrototype flag indicates if we have to set up the same [[Prototype]] prop
            // as the source object or not
            // so the constructor property will be setted like in the previous case
            // but without invoking the constructor
            if (setPrototype) {
                res = Object.create(Object.getPrototypeOf(source));
            } else {
                res = {};
            }
        }

        // sibiling safe references
        // if an object contains another object more than one times
        // storing its reference in more than one prop
        // we have to restore this state
        const safeReferences = new WeakMap;
        // obviously if the reference implies circular reference an error is thrown

        // deep copy each prop from the source object to the res object
        Object.entries(ownPropsDcps).forEach(([prop, descriptor]) => {
            const {
                value,
                enumerable
            } = descriptor;

            // the copyNonEnumerables setted to true indicates that
            // we can copy non enumerable props
            // if we mustn't copy non enumerables and the current prop is no enumerable we return
            if (!copyNonEnumerables && !enumerable) return;

            // the copySymbols setted to true indicates that
            // we can copy symbol props
            // if we mustn't copy symbols and the current prop is a symbol we return
            if (!copySymbols && typeof value == 'symbol') return;

            // copyGettersSetters setted to true indicates that
            // we can copy getters and setters
            // if we mustn't copy g||s and the current prop has g||s we return
            if (!copyGettersSetters && (descriptor.get || descriptor.set)) return;

            if (value && typeof value == 'object') {

                // PRIOR check for circular references - 
                if (references.has(value)) {
                    if (!allowCircularReferences) {
                        throw new TypeError('TypeError: circular reference found');
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

                // check for duplicated sibiling object references
                /*
                  const duplicatedObj = {};
                  const sourcej = {
                    a: duplicatedObj
                    b: duplicatedObj
                  }
                */
                if (safeReferences.has(value)) {
                    res[prop] = safeReferences.get(value);
                    return;
                }

                // The Boolean, Number, and String objects are converted
                // to the corresponding primitive values
                if (
                    value.constructor == String ||
                    value.constructor == Number ||
                    value.constructor == Boolean
                ) {
                    descriptor.value = descriptor.value.valueOf();
                    Object.defineProperty(res, prop, descriptor);
                    return;
                }

                // Date objects are cloned mantaining the same Date
                if (value.constructor == Date) {
                    descriptor.value = new Date(descriptor.value.getTime());
                    Object.defineProperty(res, prop, descriptor);
                    return;
                }
                
                // RegExp cloning is automatically supported
                if (value.constructor == RegExp) {
                    const lastIndex = descriptor.value.lastIndex;
                    descriptor.value = new RegExp(descriptor.value.source, descriptor.value.flags);
                    Object.defineProperty(res, prop, descriptor);
                    res[prop].lastIndex = lastIndex;
                    return;
                }
                
                // Promises are shallow cloned
                if (value.constructor == Promise) {
                    Object.defineProperty(res, prop, descriptor);
                    return;
                }


                // recursive deep copy for the others object props
                res[prop] = realDeepCopy(value, {
                    setPrototype,
                    invokeConstructors,
                    copyNonEnumerables,
                    copySymbols,
                    copyGettersSetters,
                    allowCircularReferences,
                }, references, start);

                // set the object reference to avoid sibiling duplicates
                // value == reference to the current object / res[prop] == reference to the resulting copied object
                safeReferences.set(value, res[prop]);
            } else {
                // shallow copy for others props
                Object.defineProperty(res, prop, descriptor);
            }
        });
 
        // circular references update from temp old values to new ones
        if (allowCircularReferences) {

            // each time an object is completed I update the references map
            // with its references. the object could still have some old circ ref
            // but I'll handle this later
            references.set(source, res);

            // if I've recurively handled all 'virtual' child
            // I've completely updated the references map
            // Now I have to recursively update all old circ refs to the new one
            if (start == source) {
               
                const alreadyVisited = new WeakMap;
                // we start from res, so it is already visited
                alreadyVisited.set(res);
                
                ;(function updateReferences(res, references) {
                    
                    Object.entries(res).forEach(([key, value]) => {
                        // only if it is an object
                        if (value && typeof value == 'object') {
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
                                if(alreadyVisited.has(value)) {
                                  return;
                                } else {
                                  alreadyVisited.set(value);
                                  updateReferences(value, references);
                                }
                            }

                        }
                    });
                })(res, references);

            }
        }

        // return the result
        return res;

    })(obj, config, references, start);
}
