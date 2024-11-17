import { Canvas } from 'canvas';
import { writeFileSync } from 'fs';

export const save = async (canvas: Canvas) => {
  // save the generated image.
  const buffer = canvas.toBuffer();
  const output = 'generated-profile.png';

  writeFileSync(output, buffer);

  console.log(`Image saved to \x1b[1m${output}\x1b[0m`);
  process.exit(1);
};
