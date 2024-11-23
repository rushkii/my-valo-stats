import { CanvasRenderingContext2D } from 'canvas';
import { MeasureType, WriteTextWithRoundedOpts } from '../types';
import { drawRoundedRect } from './roundRect';

export const writeTextWithRounded = (
  ctx: CanvasRenderingContext2D,
  {
    text,
    font,
    textColor,
    backgroundColor,
    align,
    baseline,
    x,
    y,
    padding,
    radius
  }: WriteTextWithRoundedOpts
) => {
  ctx.save();
  ctx.beginPath();

  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;

  // text calculation for responsive positions
  const metrics: MeasureType = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  let alignCalculation = 0;
  let baselineCalculation = 0;

  if (align === 'center') {
    alignCalculation = metrics.actualBoundingBoxRight + metrics.emHeightDescent! + 2;
  } else if (align === 'left' || align === 'start') {
    alignCalculation = metrics.actualBoundingBoxAscent;
  } else if (align === 'right' || align === 'end') {
    alignCalculation = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight - 6;
  }

  if (baseline === 'alphabetic') {
    baselineCalculation = 9 - metrics.alphabeticBaseline!;
    alignCalculation -= 0;
  } else if (baseline === 'bottom' || baseline === 'middle') {
    baselineCalculation = metrics.alphabeticBaseline! + 8;
    alignCalculation -= 4;
  } else if (baseline === 'hanging' || baseline === 'ideographic' || baseline === 'top') {
    baselineCalculation = metrics.alphabeticBaseline! + 8;
    alignCalculation -= 14;
  }

  const rectWidth = textWidth + padding * 2;
  const rectHeight = textHeight + padding * 2;

  ctx.fillStyle = backgroundColor;
  drawRoundedRect(ctx, {
    x: x - alignCalculation,
    y: y - padding - baselineCalculation,
    width: rectWidth - 3,
    height: rectHeight - 3,
    radius
  });

  ctx.fillStyle = textColor;
  ctx.fillText(text, x, y);

  ctx.restore();
};
