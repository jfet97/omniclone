module.exports = discardErrorObjectsFlag => {
  if (discardErrorObjectsFlag) {
    return null;
  }
  throw new TypeError("TypeError: cannot copy Error objects");
};
