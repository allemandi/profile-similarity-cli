const { program } = require('commander');
const match = require('./commands/match');

program
  .command('match')
  .description('Find similar profiles using cosine similarity')
  .requiredOption('-q, --query <path>', 'path to your profile CSV')
  .requiredOption('-d, --dataset <path>', 'path to dataset CSV') 
  .option('-k, --top-k <number>', 'number of matches to return', '5')
  .action((options) => match(options.query, options.dataset, options));

program.parse();