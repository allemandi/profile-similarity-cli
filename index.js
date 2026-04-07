const { parseArgs } = require('node:util');
const peers = require('./commands/peers');
const mentors = require('./commands/mentors');

const { values, positionals } = parseArgs({
  options: {
    query: { type: 'string', short: 'q' },
    dataset: { type: 'string', short: 'd' },
    'top-k': { type: 'string', short: 'k' },
    'min-gap': { type: 'string' },
    help: { type: 'boolean', short: 'h' },
  },
  allowPositionals: true,
  strict: false,
});

const command = positionals[0];

if (values.help || !command) {
  console.log(`
Usage: node index.js <command> [options]

Commands:
  peers     Find similar profiles
  mentors   Find potential mentors

Options:
  -q, --query <path>    Your profile CSV (required)
  -d, --dataset <path>  Dataset CSV (required)
  -k, --top-k <number>  Number of results to return (default: 5)
  --min-gap <number>    Minimum skill gap for mentors (default: 2)
  -h, --help            Show help
  `);
  process.exit(0);
}

if (!values.query || !values.dataset) {
  console.error('Error: --query and --dataset are required');
  process.exit(1);
}

const topK = Number(values['top-k']) || 5;

(async () => {
  try {
    if (command === 'peers') {
      await peers(values.query, values.dataset, topK);
    } else if (command === 'mentors') {
      const minGap = Number(values['min-gap']) || 2;
      await mentors(values.query, values.dataset, topK, minGap);
    } else {
      console.error(`Unknown command: ${command}`);
      process.exit(1);
    }
  } catch (err) {
    console.error('An unexpected error occurred:', err);
    process.exit(1);
  }
})();
