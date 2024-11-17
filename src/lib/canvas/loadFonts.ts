import { registerFont } from 'canvas';
import { glob } from 'glob';

export const loadFonts = async () => {
  // please manually install the fonts in your OS machine.

  const fonts = await glob('./src/assets/fonts/**/*.ttf', {
    ignore: 'node_modules/**'
  });

  for (const font of fonts) {
    const toFamily = font.replace(/\\/g, '/').split('/').at(-1)?.replace('.ttf', '')!;
    registerFont(font, { family: toFamily });
  }
};
