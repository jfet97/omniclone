const updateCircReferencesIntoMapObjects = require("./utility/updateCircReferencesIntoMapObjects");
const updateCircReferencesIntoSetObjects = require("./utility/updateCircReferencesIntoSetObjects");
const updateCircReferencesIntoOtherObjects = require("./utility/updateCircReferencesIntoOtherObjects");

module.exports = function updateReferences(res, references) {
  // res is an object

  const alreadyVisitedMap = new WeakMap();
  // we start from res, so it is already visited
  alreadyVisitedMap.set(res);

  (function innerUpdateReferences(res, references, alreadyVisitedMap) {
    if (res instanceof Map) {
      return updateCircReferencesIntoMapObjects(
        res,
        references,
        alreadyVisitedMap,
        innerUpdateReferences
      );
    }
    if (res instanceof Set) {
      return updateCircReferencesIntoSetObjects(
        res,
        references,
        alreadyVisitedMap,
        innerUpdateReferences
      );
    }
    return updateCircReferencesIntoOtherObjects(
      res,
      references,
      alreadyVisitedMap,
      innerUpdateReferences
    );
  })(res, references, alreadyVisitedMap);
};
