import { readFileSync, rmSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

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

const naturalSort = (a: string, b: string) => {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
};

export const rewriteMatchHistory = () => {
  const readme = readFileSync('README.md', 'utf8');

  const files = globSync('output/matches/*.png', {
    posix: true,
    dotRelative: true,
    ignore: 'output/**/details'
  });
  const results = files
    .toSorted((a, b) => naturalSort(a, b))
    .map((e) => `  <img src="${e}" />`)
    .join('\n');

  const updated = readme.replace(
    /<!-- BEGIN MATCH HISTORY -->[\s\S]*?<!-- END MATCH HISTORY -->/,
    `<!-- BEGIN MATCH HISTORY -->\n${results}\n<!-- END MATCH HISTORY -->`
  );

  writeFileSync('README.md', updated);
};

export const resetOutputs = () => {
  rmSync('output', { recursive: true, force: true });
};
