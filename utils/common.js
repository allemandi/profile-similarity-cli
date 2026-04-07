const { findNearestNeighbors } = require('@allemandi/embed-utils');
const { loadProfiles, toEmbedding } = require('./data');

/**
 * Filters the fields of a query object to only include those that are also present in the data object and are finite numbers.
 */
const getUsedFields = (queryObj, dataObj) =>
  Object.keys(queryObj).filter(f => {
    if (f === 'name') return false;
    if (dataObj[f] === undefined) return false;
    const val = Number(queryObj[f]);
    return Number.isFinite(val);
  });

/**
 * Finds mentorship gaps between two sets of skills.
 */
const findMentorshipGaps = (yourSkills, theirSkills, skillNames, threshold = 2) => {
  const gaps = [];
  for (let i = 0; i < yourSkills.length; i++) {
    const gap = theirSkills[i] - yourSkills[i];
    if (gap >= threshold) {
      gaps.push({
        skill: skillNames[i],
        yourLevel: yourSkills[i],
        theirLevel: theirSkills[i],
        gap,
      });
    }
  }
  return gaps;
};

/**
 * Loads and processes the profiles from the given paths.
 */
const loadAndProcessProfiles = async (queryPath, datasetPath) => {
  const { queryProfile, profiles } = await loadProfiles(queryPath, datasetPath);
  const fields = getUsedFields(queryProfile, profiles[0]);
  const queryEmbedding = toEmbedding(queryProfile, fields);

  const samples = profiles.map(profile => ({
    embedding: toEmbedding(profile, fields),
    label: profile.name || profile.label || '',
    row: profile,
  }));

  return { queryProfile, profiles, fields, queryEmbedding, samples };
};

module.exports = {
  getUsedFields,
  findMentorshipGaps,
  findNearestNeighbors,
  loadAndProcessProfiles,
};
