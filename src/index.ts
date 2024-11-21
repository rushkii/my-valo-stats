import { generateMatches, generateProfileCard } from './generate';
import { resetOutputs, rewriteMatchHistory } from './lib/utils';

const main = async () => {
  resetOutputs();
  await Promise.all([generateProfileCard(), generateMatches()]);
  rewriteMatchHistory();
};

if (require.main === module) {
  main();
}
