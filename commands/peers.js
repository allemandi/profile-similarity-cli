const { findNearestNeighbors } = require('@allemandi/embed-utils');
const { parseCSV, toEmbedding } = require('../utils/csv');
const { getUsedFields } = require('../utils/sanitizer');
const { formatMatchOutput } = require('../utils/format');

const peers = async (queryPath, datasetPath, topK = 5) => {
  try {
    const queryArr = await parseCSV(queryPath);
    const profiles = await parseCSV(datasetPath);
    const queryProfile = queryArr[0];
    if (!queryProfile || profiles.length === 0) throw new Error('No profiles found.');
    const fields = getUsedFields(queryProfile, profiles[0]);
    const queryEmbedding = toEmbedding(queryProfile, fields);
    const samples = profiles.map(profile => ({
      embedding: toEmbedding(profile, fields),
      label: profile.name || profile.label || '',
      row: profile
    }));
    const results = findNearestNeighbors(queryEmbedding, samples, { topK: +topK });
    formatMatchOutput(results, queryProfile, fields);
  } catch (e) {
    console.error('[MATCH ERROR]', e.message);
    process.exit(1);
  }
};

module.exports = peers;
