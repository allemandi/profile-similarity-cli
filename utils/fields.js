/**
 * Filters the fields of a query object to only include those that are also present in the data object and are finite numbers.
 * @param {Object} queryObj - The query object.
 * @param {Object} dataObj - The data object.
 * @returns {Array<string>} - An array of the used fields.
 */
const getUsedFields = (queryObj, dataObj) =>
  Object.keys(queryObj).filter(f => {
    if (f === 'name') return false;
    if (dataObj[f] === undefined) return false;
    // Only keep if the value in queryObj is a finite number
    const val = Number(queryObj[f]);
    return Number.isFinite(val);
  });

module.exports = { getUsedFields };
