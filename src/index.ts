import { generateProfileCard } from './generate';

const main = () => {
  generateProfileCard();
};

if (require.main === module) {
  main();
}
