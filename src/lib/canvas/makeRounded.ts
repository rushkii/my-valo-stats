import { CanvasRenderingContext2D } from 'canvas';

export const makeCanvasRounded = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, [20]);
  ctx.clip();
};

export const makeAvatarRounded = (
  ctx: CanvasRenderingContext2D,
  { x, y, radius }: { x: number; y: number; radius: number }
) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.clip();
};
