const fs = require('fs').promises;

/**
 * Parses a CSV file into an array of objects.
 * @param {string} file - The path to the CSV file.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of objects.
 */
const parseCSV = async file => {
  const content = await fs.readFile(file, 'utf-8');
  const [header, ...rows] = content.trim().split('\n');
  const fields = header.split(',').map(f => f.trim());
  return rows.map(r =>
    Object.fromEntries(r.split(',').map((v, i) => [fields[i], v.trim()]))
  );
};

/**
 * Converts a profile object to an embedding vector.
 * @param {Object} p - The profile object.
 * @param {Array<string>} fields - The fields to include in the embedding.
 * @returns {Array<number>} - The embedding vector.
 */
const toEmbedding = (p, fields) => fields.map(f => Number(p[f]));

/**
 * Loads and parses the query and dataset profiles from CSV files.
 * @param {string} queryPath - The path to the query profile CSV.
 * @param {string} datasetPath - The path to the dataset CSV.
 * @returns {Promise<{queryProfile: Object, profiles: Array<Object>}>} - A promise that resolves to the loaded profiles.
 */
const loadProfiles = async (queryPath, datasetPath) => {
  const queryArr = await parseCSV(queryPath);
  const profiles = await parseCSV(datasetPath);
  if (!queryArr.length || !profiles.length) {
    throw new Error('No profiles found.');
  }
  return { queryProfile: queryArr[0], profiles };
};

module.exports = { parseCSV, toEmbedding, loadProfiles };
