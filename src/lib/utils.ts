import { rmSync } from 'fs';

export const getRrankImage = (rank: string) => {
  return `./src/assets/images/ranks/${rank.toLowerCase().replace(' ', '_')}_small.png`;
};

export const toHumanTime = (millis: number) => {
  const pad = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  const totalSeconds = Math.floor(millis / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let result = hours > 0 ? hours + ':' : '';
  result = `${pad(minutes)}:${pad(seconds)}`;

  return result;
};

export const resetOutputs = () => {
  rmSync('output', { recursive: true, force: true });
};
