const { findNearestNeighbors, loadAndProcessProfiles } = require('../utils/common');
const { formatMentorsOutput } = require('../utils/format');

const mentors = async (queryPath, datasetPath, topK = 5, minGap = 2) => {
  try {
    const { queryEmbedding, samples, fields } = await loadAndProcessProfiles(
      queryPath,
      datasetPath
    );

    const results = findNearestNeighbors(queryEmbedding, samples, { topK });

    formatMentorsOutput(results, queryEmbedding, fields, minGap);
  } catch (e) {
    console.error('[MENTORSHIP ERROR]', e.message);
    process.exit(1);
  }
};

module.exports = mentors;
