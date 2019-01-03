function deepCopy(obj = {}, {
    setPrototype = false,
    invokeConstructors = true,
    copyNonEnumerables = false,
    copySymbols = false,
    copyGettersSetters = false,
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

    // circular references guard
    const references = new WeakMap;

    return (function realDeepCopy(source, {
        setPrototype,
        invokeConstructors,
        copyNonEnumerables,
        copySymbols,
        copyGettersSetters,
    }) {

        // set a reference for the current obj
        references.set(source, source);

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
            if (setPrototype) {
                res = Object.create(Object.getPrototypeOf(source));
            } else {
                res = {};
            }
        }


        const objectReferences = new WeakMap;

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

            if (value && typeof value == 'object') {

                // check for duplicated object references
                /*
                  const duplicatedObj = {};

                  const sourcej = {
                    a: duplicatedObj
                    b: duplicatedObj
                  }
                */
                if (objectReferences.has(value)) {
                    res[prop] = objectReferences.get(value);
                    return;
                }

                // check for circular references
                // self reference
                if (references.has(value)) {
                    throw new TypeError('TypeError: circular reference found');
                }

                // recursive deep copy if the descriptor.value is an object
                res[prop] = realDeepCopy(value, {
                    setPrototype,
                    invokeConstructors
                });

                // set the object reference to avoid duplicates
                objectReferences.set(value, res[prop]);
            } else {
                // shallow copy for others props
                Object.defineProperty(res, prop, descriptor);
            }

        });

        return res;

    })(obj, config);
}
