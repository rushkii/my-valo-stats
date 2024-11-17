import { CanvasRenderingContext2D } from "canvas";

export const makeRounded = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, [40]);
  ctx.clip();
};
