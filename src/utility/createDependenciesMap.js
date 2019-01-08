// it create a Map of set
// each set cointain a list of all the "dependencies" of a node N
// a dependence is simply a node referred by N
// a set because we do not care about same sibiling object references
// one reference to a node is equal to 10 reference to the same node if the reference are stored in the same object
// because we are looking for circ references. If the one reference was a circ reference it would have been the same with 10

module.exports = (
  entryPoint,
  copyNonEnumerables = false,
  copySymbols = false
) => {
  const alreadyVisited = new Set();
  const allDependenciesMap = new Map();

  (function createDependenciesMap(obj) {
    // add the current obj to the alreadyVisited set guard
    alreadyVisited.add(obj);

    const depsSet = new Set();

    if (obj instanceof Map) {
      [...obj.entries()].forEach(([, value]) => {
        // we do not care about type of key because
        // a map will be completely cloned, always

        // discard functions (always entirely copied by reference)
        if (typeof value === "object") {
          // we have to worry only about object prop
          depsSet.add(value);

          // if the object value has not already been visited, we analize it
          if (!alreadyVisited.has(value)) {
            createDependenciesMap(value);
          }
        }
      });
    } else if (obj instanceof Set) {
      [...obj.values()].forEach(value => {
        // we do not care about type of values because
        // a set will be completely cloned, always

        // discard functions (always entirely copied by reference)
        if (typeof value === "object") {
          // we have to worry only about object prop
          depsSet.add(value);

          // if the object value has not already been visited, we analize it
          if (!alreadyVisited.has(value)) {
            createDependenciesMap(value);
          }
        }
      });
    } else if (copyNonEnumerables || copySymbols) {
      // normal object case
      // if we have to care about symbols or non enum props...

      const descriptors = Object.getOwnPropertyDescriptors(obj);

      Object.entries(descriptors).forEach(([prop, descriptor]) => {
        // descriptor.value == value of each prop == potential reference to a node

        if (descriptor.set || descriptor.get) {
          // don't care about getters and setters
          // them are functions that will be copied by reference
          return;
        }

        if (descriptor.enumerable === false && copyNonEnumerables === false) {
          // if so we have to don't care about non-enum props because
          // them will be not copied
          return;
        }

        if (typeof prop === "symbol" && copySymbols === false) {
          // if so we have to don't care about symbol props because
          // them will be not copied
          return;
        }

        // if we get here the prop (/)that refers to a value or to any type of object) could be
        // an enum prop non symbol prop so we have to worry about it
        // or a non-enum prop non symbol but the flag copyNonEnumerables is true so we have to worry about it
        // or an enum symbol prop (the key is a symbol) but the flag copySymbol is true so we have to worry about it
        // or an non enum symbol prop (the key is a symbol) but both fag are set to true so we have to worry about it

        // in short words we have already discarded what we don't want

        const { value } = descriptor;

        // discard functions
        if (value && typeof value === "object") {
          // we have to worry only about object prop
          depsSet.add(value);

          // if the object value has not already been visited, we analize it
          if (!alreadyVisited.has(value)) {
            createDependenciesMap(value);
          }
        }
      });
    } else {
      // normal object case
      // if we care only about enum non symbol own props
      Object.values(obj).forEach(value => {
        // value == value of each prop == potential reference to a node

        // discard functions
        if (typeof value === "object") {
          // we have to worry only about object prop
          depsSet.add(value);

          // if the object value has not already been visited,, we analize it
          if (!alreadyVisited.has(value)) {
            createDependenciesMap(value);
          }
        }
      });
    }

    // here the node is completely analized
    allDependenciesMap.set(obj, depsSet);
  })(entryPoint);

  return allDependenciesMap;
};
