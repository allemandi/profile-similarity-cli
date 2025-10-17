const { loadProfiles, toEmbedding } = require('./data');
const { getUsedFields } = require('./sanitizer');

/**
 * Loads and processes the profiles from the given paths.
 * @param {string} queryPath - The path to the query profile CSV.
 * @param {string} datasetPath - The path to the dataset CSV.
 * @returns {Promise<{queryProfile: Object, profiles: Array<Object>, fields: Array<string>, queryEmbedding: Array<number>, samples: Array<Object>}>} - A promise that resolves to the processed profiles.
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

module.exports = { loadAndProcessProfiles };