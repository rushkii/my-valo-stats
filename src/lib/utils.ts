import { readFileSync, rmSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import * as cheerio from 'cheerio';
import { Element } from 'domhandler';
import { ContentElement, ExtractedElement, ParticipantType } from './types';

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

const getElementObject = (
  root: cheerio.Cheerio<Element>,
  $: cheerio.CheerioAPI
): ExtractedElement => {
  const elementName = root[0].tagName;
  const attributes = root.attr();
  const children = root.contents();

  const childrenContent: ContentElement[] = [];

  children.each((_, child) => {
    if (child.type === 'tag') {
      const childElement = $(child);
      childrenContent.push(getElementObject(childElement, $));
    } else if (child.type === 'text') {
      const text = child.data.trim();
      if (text) childrenContent.push(text);
    }
  });

  return {
    tagName: elementName,
    attributes: attributes || {},
    content: childrenContent
  };
};

export const loadElementFromString = (element: string) => {
  const $ = cheerio.load(element);
  const root = $('span').first();
  return getElementObject(root, $);
};

export const isMvp = (puuid: string, participants: ParticipantType[]) => {
  return participants.find((e) => e.flair)?.playerPUUID === puuid;
};
