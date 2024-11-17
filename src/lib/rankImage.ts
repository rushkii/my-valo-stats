export const getRrankImage = (rank: string) => {
  return `./src/assets/images/ranks/${rank.toLowerCase().replace(' ', '_')}_small.png`;
};
