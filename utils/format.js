const { findMentorshipGaps } = require('./common');

/**
 * Formats the output for the peers command.
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
        `  ${f.padStart(20)}${String(qv).padStart(3)} -> ${String(pv).padStart(3)}   ${`(${sign}${diff})`.padEnd(
          6
        )}${tag ? `   ${tag}` : ''}`
      );
    }
    console.log('-'.repeat(50) + '\n');
  }
};

/**
 * Formats the output for the mentors command.
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
          `    ${gap.skill.padStart(20)}: ${String(gap.yourLevel).padStart(3)} -> ${String(
            gap.theirLevel
          ).padStart(3)}   (gap: +${gap.gap})`
        );
      });
    } else {
      console.log('  No significant mentorship gaps.');
    }
    console.log('-'.repeat(50) + '\n');
  }
};

module.exports = { formatMatchOutput, formatMentorsOutput };
