// check if a graph is topologically sortable
// analizyng the dependencies Map
//
// if the result of the process is not an empty map there are
// circ referencies
//
// https://stackoverflow.com/questions/1347533/how-do-i-detect-circular-logic-or-recursion-in-a-multi-levels-references-and-dep
// 1 I check if at least one entry in the map is an empty array. If not the structure contains circ references because
// 2 there are no nodes without dependencies
// 3 If I found one empty array, the corresponding node (the key in the map) is an edge node
// 4 I remove its reference from all the other arrays then I remove the entry
// Then I Repeat from line 1

function removeReference(referenceToRemove, map) {
  [...map.entries()].forEach(([, set]) => {
    if (set.has(referenceToRemove)) {
      set.delete(referenceToRemove);
    }
  });
}

function dependenciesMapHandler(map) {
  // all the map analized, return it
  if (map.size === 0) return map;

  const keySetPair = [...map.entries()].find(([, set]) => set.size === 0);

  if (!keySetPair) {
    // no more empty array found, return the map at the current state
    return map;
  }

  const [ref] = keySetPair;

  // remove the reference from all the other arrays
  removeReference(ref, map);

  // now I can remove the key (ref)
  map.delete(ref);

  // recursively analize the rest of the map
  return dependenciesMapHandler(map);
}

function checkCircRefs(map) {
  return !dependenciesMapHandler(map).size;
}

module.exports = checkCircRefs;
