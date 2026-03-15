const { findNearestNeighbors } = require('@allemandi/embed-utils');
const { loadAndProcessProfiles, formatMatchOutput } = require('../utils');

const peers = async (queryPath, datasetPath, topK = 5) => {
  try {
    const { queryProfile, fields, queryEmbedding, samples } =
      await loadAndProcessProfiles(queryPath, datasetPath);

    const results = findNearestNeighbors(queryEmbedding, samples, {
      topK: +topK,
    });
    formatMatchOutput(results, queryProfile, fields);
  } catch (e) {
    console.error('[MATCH ERROR]', e.message);
    process.exit(1);
  }
};

module.exports = peers;
