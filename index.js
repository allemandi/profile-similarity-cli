const { program } = require('commander');
const peers = require('./commands/peers');
const mentors = require('./commands/mentors');

program
  .command('peers')
  .description('Find similar profiles')
  .requiredOption('-q, --query <path>', 'your profile CSV')
  .requiredOption('-d, --dataset <path>', 'dataset CSV')
  .option('-k, --top-k <number>', 'matches to return', '5')
  .action(async o => peers(o.query, o.dataset, Number(o.topK) || 5));

program
  .command('mentors')
  .description('Find potential mentors')
  .requiredOption('-q, --query <path>', 'your profile CSV')
  .requiredOption('-d, --dataset <path>', 'dataset CSV')
  .option('-k, --top-k <number>', 'mentors to return', '5')
  .option('--min-gap <number>', 'minimum skill gap', '2')
  .action(async o => mentors(o.query, o.dataset, Number(o.topK) || 5, Number(o.minGap) || 2));

program.parse();