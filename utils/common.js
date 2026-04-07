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
 * Calculates the cosine similarity between two vectors.
 */
const cosineSimilarity = (a, b) => {
  let dotProduct = 0, mA = 0, mB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    mA += a[i] * a[i];
    mB += b[i] * b[i];
  }
  return mA === 0 || mB === 0 ? 0 : dotProduct / (Math.sqrt(mA) * Math.sqrt(mB));
};

/**
 * Finds the nearest neighbors for a given query embedding.
 */
const findNearestNeighbors = (queryEmbedding, samples, options = {}) => {
  const { topK = 5 } = options;
  const results = samples.map(sample => ({
    ...sample,
    similarityScore: cosineSimilarity(queryEmbedding, sample.embedding),
  }));

  return results
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, topK);
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
  cosineSimilarity,
  findNearestNeighbors,
  loadAndProcessProfiles,
};
