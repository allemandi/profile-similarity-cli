const fs = require('fs').promises;

// From fields.js
const getUsedFields = (queryObj, dataObj) =>
  Object.keys(queryObj).filter(f => {
    if (f === 'name') return false;
    if (dataObj[f] === undefined) return false;
    const val = Number(queryObj[f]);
    return Number.isFinite(val);
  });

// From profiles.js
const parseCSV = async file => {
  const content = await fs.readFile(file, 'utf-8');
  const [header, ...rows] = content.trim().split('\n');
  const fields = header.split(',').map(f => f.trim());
  return rows.map(r =>
    Object.fromEntries(r.split(',').map((v, i) => [fields[i], v.trim()]))
  );
};

const toEmbedding = (p, fields) => fields.map(f => Number(p[f]));

const loadProfiles = async (queryPath, datasetPath) => {
  const queryArr = await parseCSV(queryPath);
  const profiles = await parseCSV(datasetPath);
  if (!queryArr.length || !profiles.length) {
    throw new Error('No profiles found.');
  }
  return { queryProfile: queryArr[0], profiles };
};

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

// From mentorship.js
function findMentorshipGaps(yourSkills, theirSkills, skillNames, threshold = 2) {
  const gaps = [];
  for (let i = 0; i < yourSkills.length; i++) {
    if (theirSkills[i] - yourSkills[i] >= threshold) {
      gaps.push({
        skill: skillNames[i],
        yourLevel: yourSkills[i],
        theirLevel: theirSkills[i],
        gap: theirSkills[i] - yourSkills[i],
      });
    }
  }
  return gaps;
}

// From format.js
const pad = (s, l, right = false) =>
  right
    ? String(s) + ' '.repeat(l - String(s).length)
    : ' '.repeat(l - String(s).length) + String(s);

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


module.exports = {
  loadAndProcessProfiles,
  formatMatchOutput,
  formatMentorsOutput,
};
