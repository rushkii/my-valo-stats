import { loadImage } from 'canvas';

export const loadImages = async (images: string[] | Buffer[]) => {
  const promises = images.map((e) => loadImage(e));

  return await Promise.all(promises);
};
