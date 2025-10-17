const getUsedFields = (queryObj, dataObj) =>
  Object.keys(queryObj).filter(f => {
    if (f === 'name') return false;
    if (dataObj[f] === undefined) return false;
    // Only keep if the value in queryObj is a finite number
    const val = Number(queryObj[f]);
    return Number.isFinite(val);
  });

module.exports = { getUsedFields };
