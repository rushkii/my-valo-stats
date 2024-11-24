import { CanvasRenderingContext2D } from 'canvas';
import { WriteTextWithRoundedOpts } from '../types';
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

  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;

  const fontSize = parseInt(font);

  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textAscent = metrics.actualBoundingBoxAscent || metrics.fontBoundingBoxAscent || fontSize;
  const textDescent =
    metrics.actualBoundingBoxDescent || metrics.fontBoundingBoxDescent || fontSize * 0.2;
  const textHeight = textAscent + textDescent;

  const rectWidth = textWidth + padding * 2;
  const rectHeight = textHeight + padding * 2;

  let rectX = x;
  switch (align) {
    case 'start':
    case 'left':
      rectX = x;
      break;
    case 'end':
    case 'right':
      rectX = x - rectWidth;
      break;
    case 'center':
      rectX = x - rectWidth / 2;
      break;
  }

  let rectY = y;
  let textY = y;

  switch (baseline) {
    case 'alphabetic':
      rectY = y - textAscent - padding;
      break;
    case 'top':
    case 'hanging':
      rectY = y;
      textY = y + padding;
      break;
    case 'middle':
      rectY = y - rectHeight / 2;
      break;
    case 'bottom':
    case 'ideographic':
      rectY = y - rectHeight;
      textY = y - padding;
      break;
  }

  const maxRadius = Math.min(radius, rectWidth / 2, rectHeight / 2);

  ctx.fillStyle = backgroundColor;
  drawRoundedRect(ctx, {
    x: rectX,
    y: rectY,
    width: rectWidth,
    height: rectHeight,
    radius: maxRadius
  });

  let textX = x;
  switch (align) {
    case 'start':
    case 'left':
      textX = rectX + padding;
      break;
    case 'end':
    case 'right':
      textX = rectX + rectWidth - padding;
      break;
    case 'center':
      textX = rectX + rectWidth / 2;
      break;
  }

  ctx.fillStyle = textColor;
  ctx.fillText(text, textX, textY);

  ctx.restore();
};
