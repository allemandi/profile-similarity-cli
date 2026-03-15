const fs = require('fs').promises;

/**
 * Pads a string with spaces to a certain length.
 * @param {string|number} s - The value to pad.
 * @param {number} l - The desired length.
 * @param {boolean} [right=false] - Whether to pad on the right.
 * @returns {string} - The padded string.
 */
const pad = (s, l, right = false) => {
  const str = String(s);
  return right ? str.padEnd(l) : str.padStart(l);
};

/**
 * Parses a CSV file into an array of objects.
 * @param {string} file - The path to the CSV file.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of objects.
 */
const parseCSV = async file => {
  try {
    const content = await fs.readFile(file, 'utf-8');
    const [header, ...rows] = content.trim().split('\n');
    if (!header) return [];

    const fields = header.split(',').map(f => f.trim());
    return rows.map(r =>
      Object.fromEntries(r.split(',').map((v, i) => [fields[i], v.trim()]))
    );
  } catch (err) {
    throw new Error(`Failed to parse CSV at ${file}: ${err.message}`);
  }
};

/**
 * Filters the fields of a query object to only include those that are also present in the data object and are finite numbers.
 * @param {Object} queryObj - The query object.
 * @param {Object} dataObj - The data object.
 * @returns {Array<string>} - An array of the used fields.
 */
const getUsedFields = (queryObj, dataObj) =>
  Object.keys(queryObj).filter(f => {
    if (f === 'name') return false;
    if (dataObj[f] === undefined) return false;
    const val = Number(queryObj[f]);
    return Number.isFinite(val);
  });

/**
 * Converts a profile object to an embedding vector.
 * @param {Object} p - The profile object.
 * @param {Array<string>} fields - The fields to include in the embedding.
 * @returns {Array<number>} - The embedding vector.
 */
const toEmbedding = (p, fields) => fields.map(f => Number(p[f]));

/**
 * Finds mentorship gaps between two sets of skills.
 * @param {Array<number>} yourSkills - Your skills embedding.
 * @param {Array<number>} theirSkills - Their skills embedding.
 * @param {Array<string>} skillNames - The names of the skills.
 * @param {number} threshold - The minimum gap to be considered a mentorship opportunity.
 * @returns {Array<Object>} - An array of mentorship gaps.
 */
const findMentorshipGaps = (yourSkills, theirSkills, skillNames, threshold) => {
  return yourSkills.reduce((gaps, yourLevel, i) => {
    const theirLevel = theirSkills[i];
    const gap = theirLevel - yourLevel;
    if (gap >= threshold) {
      gaps.push({ skill: skillNames[i], yourLevel, theirLevel, gap });
    }
    return gaps;
  }, []);
};

/**
 * Loads and processes the profiles from the given paths.
 * @param {string} queryPath - The path to the query profile CSV.
 * @param {string} datasetPath - The path to the dataset CSV.
 * @returns {Promise<Object>} - The processed profiles and embeddings.
 */
const loadAndProcessProfiles = async (queryPath, datasetPath) => {
  const [queryArr, profiles] = await Promise.all([
    parseCSV(queryPath),
    parseCSV(datasetPath),
  ]);

  if (!queryArr.length || !profiles.length) {
    throw new Error('No profiles found in one or both files.');
  }

  const queryProfile = queryArr[0];
  const fields = getUsedFields(queryProfile, profiles[0]);
  const queryEmbedding = toEmbedding(queryProfile, fields);

  const samples = profiles.map(profile => ({
    embedding: toEmbedding(profile, fields),
    label: profile.name || profile.label || 'Unknown',
    row: profile,
  }));

  return { queryProfile, profiles, fields, queryEmbedding, samples };
};

/**
 * Formats the output for the peers command.
 * @param {Array<Object>} results - The results from the nearest neighbor search.
 * @param {Object} queryProfile - The query profile.
 * @param {Array<string>} fields - The fields to include in the output.
 */
const formatMatchOutput = (results, queryProfile, fields) => {
  console.log('Top Matches\n============\n');
  results.forEach((r, i) => {
    console.log(`#${i + 1} ${r.label}  (Similarity: ${(+r.similarityScore).toFixed(3)})`);
    console.log('-'.repeat(50));
    fields.forEach(f => {
      const qv = Number(queryProfile[f]);
      const pv = Number(r.row[f]);
      const diff = pv - qv;
      const tag = diff === 0 ? 'EXACT' : '';
      const sign = diff > 0 ? '+' : '';
      console.log(
        `  ${pad(f, 20)}${pad(qv, 3)} -> ${pad(pv, 3)}   ${pad(`(${sign}${diff})`, 6, true)}${tag ? `   ${tag}` : ''}`
      );
    });
    console.log('-'.repeat(50) + '\n');
  });
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
  results.forEach((r, i) => {
    const gaps = findMentorshipGaps(queryEmbedding, r.embedding, fields, minGap);
    console.log(
      `#${i + 1} ${r.label} (Similarity: ${r.similarityScore.toFixed(3)}) | Unique Mentorship Skills: ${gaps.length}`
    );
    if (gaps.length > 0) {
      console.log('  Can mentor you in:');
      gaps.forEach(gap => {
        console.log(
          `    ${pad(gap.skill, 20)}: ${pad(gap.yourLevel, 3)} -> ${pad(gap.theirLevel, 3)}   (gap: +${gap.gap})`
        );
      });
    } else {
      console.log('  No significant mentorship gaps.');
    }
    console.log('-'.repeat(50) + '\n');
  });
};

module.exports = {
  loadAndProcessProfiles,
  formatMatchOutput,
  formatMentorsOutput,
};
