const { findNearestNeighbors } = require('@allemandi/embed-utils');
const { parseCSV, toEmbedding } = require('../utils/csv');
const { getUsedFields } = require('../utils/sanitizer');
const { findMentorshipGaps } = require('../utils/mentorship');
const { pad } = require('../utils/format');

const mentors = async (queryPath, datasetPath, topK = 5, minGap = 2) => {
  try {
    const queryArr = await parseCSV(queryPath);
    const profiles = await parseCSV(datasetPath);
    const queryProfile = queryArr[0];
    if (!queryProfile || profiles.length === 0) throw new Error('No profiles found.');
    const fields = getUsedFields(queryProfile, profiles[0]);
    const skillNames = fields;
    const queryEmbedding = toEmbedding(queryProfile, fields);
    const samples = profiles.map(profile => ({
      embedding: toEmbedding(profile, fields),
      label: profile.name || profile.label || '',
      row: profile
    }));
    const results = findNearestNeighbors(queryEmbedding, samples, { topK });
    console.log('Top Mentors\n============\n');
    for (const [i, r] of results.entries()) {
      const mentorSkills = r.embedding;
      const gaps = findMentorshipGaps(queryEmbedding, mentorSkills, skillNames, minGap);
      const mentorshipScore = gaps.length;
      console.log(`#${i+1} ${r.label}  (Similarity: ${(r.similarityScore).toFixed(3)}) | Unique Mentorship Skills: ${mentorshipScore}`);
      if (gaps.length > 0) {
        console.log('  Can mentor you in:');
        gaps.forEach(gap => {
          console.log(`    ${pad(gap.skill,20)}: ${pad(gap.yourLevel, 3)} -> ${pad(gap.theirLevel, 3)}   (gap: +${gap.gap})`);
        });
      } else {
        console.log('  No significant mentorship gaps.');
      }
      console.log('-'.repeat(50)+'\n');
    }
  } catch (e) {
    console.error('[MENTORSHIP ERROR]', e.message);
    process.exit(1);
  }
};

module.exports = mentors;
