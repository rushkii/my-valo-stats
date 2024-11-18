import { Canvas } from 'canvas';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

export const save = async (canvas: Canvas, path: string) => {
  // save the generated image.
  const buffer = canvas.toBuffer();
  const directory = dirname(path);

  if (!existsSync(directory)) mkdirSync(directory, { recursive: true });
  writeFileSync(path, buffer);

  console.log(`Image saved to \x1b[1m${path}\x1b[0m`);
  process.exit(1);
};
