module.exports = regexp => {
  const { source, flags, lastIndex } = regexp;
  const newReg = new RegExp(source, flags);
  newReg.lastIndex = lastIndex;
  return newReg;
};
