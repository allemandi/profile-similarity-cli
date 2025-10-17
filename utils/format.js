const { findMentorshipGaps } = require('./mentorship');

/**
 * Pads a string with spaces to a certain length.
 * @param {string} s - The string to pad.
 * @param {number} l - The desired length.
 * @param {boolean} [right=false] - Whether to pad on the right.
 * @returns {string} - The padded string.
 */
const pad = (s, l, right = false) =>
  right
    ? String(s) + ' '.repeat(l - String(s).length)
    : ' '.repeat(l - String(s).length) + String(s);

/**
 * Formats the output for the peers command.
 * @param {Array<Object>} results - The results from the nearest neighbor search.
 * @param {Object} queryProfile - The query profile.
 * @param {Array<string>} fields - The fields to include in the output.
 */
const formatMatchOutput = (results, queryProfile, fields) => {
  console.log('Top Matches\n============\n');
  for (const [i, r] of results.entries()) {
    console.log(
      `#${i + 1} ${r.label}  (Similarity: ${(+r.similarityScore).toFixed(3)})`
    );
    console.log('-'.repeat(50));
    for (const f of fields) {
      const qv = queryProfile[f],
        pv = r.row[f],
        diff = pv - qv,
        tag = diff === 0 ? 'EXACT' : '';
      const sign = diff > 0 ? '+' : '';
      console.log(
        `  ${pad(f, 20)}${pad(qv, 3)} -> ${pad(pv, 3)}   ${pad(
          `(${sign}${diff})`,
          6,
          true
        )}${tag ? `   ${tag}` : ''}`
      );
    }
    console.log('-'.repeat(50) + '\n');
  }
};

/**
 * Formats the output for the mentors command.
 * @param {Array<Object>} results - The results from the nearest neighbor search.
 * @param {Array<number>} queryEmbedding - The query embedding.
 * @param {Array<string>} fields - The fields to include in the output.
 * @param {number} minGap - The minimum gap to be considered a mentorship opportunity.
 */
const formatMentorsOutput = (results, queryEmbedding, fields, minGap) => {
  console.log('Top Mentors\n============\n');
  for (const [i, r] of results.entries()) {
    const mentorSkills = r.embedding;
    const gaps = findMentorshipGaps(
      queryEmbedding,
      mentorSkills,
      fields,
      minGap
    );
    const mentorshipScore = gaps.length;
    console.log(
      `#${i + 1} ${r.label} (Similarity: ${r.similarityScore.toFixed(
        3
      )}) | Unique Mentorship Skills: ${mentorshipScore}`
    );
    if (gaps.length > 0) {
      console.log('  Can mentor you in:');
      gaps.forEach(gap => {
        console.log(
          `    ${pad(gap.skill, 20)}: ${pad(gap.yourLevel, 3)} -> ${pad(
            gap.theirLevel,
            3
          )}   (gap: +${gap.gap})`
        );
      });
    } else {
      console.log('  No significant mentorship gaps.');
    }
    console.log('-'.repeat(50) + '\n');
  }
};

module.exports = { pad, formatMatchOutput, formatMentorsOutput };
