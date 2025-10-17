const fs = require('fs').promises;

const parseCSV = async file => {
  const content = await fs.readFile(file, 'utf-8');
  const [header, ...rows] = content.trim().split('\n');
  const fields = header.split(',');
  return rows.map(r => Object.fromEntries(r.split(',').map((v, i) => [fields[i], v])));
};

const toEmbedding = (p, fields) => fields.map(f => Number(p[f]));

module.exports = { parseCSV, toEmbedding };
