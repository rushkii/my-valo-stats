import { CanvasRenderingContext2D } from 'canvas';

interface MeasureType {
  width: number;
  actualBoundingBoxLeft: number;
  actualBoundingBoxRight: number;
  actualBoundingBoxAscent: number;
  actualBoundingBoxDescent: number;
  emHeightAscent?: number;
  emHeightDescent?: number;
  alphabeticBaseline?: number;
}

export const writeTextUnderline = (
  ctx: CanvasRenderingContext2D,
  { text, x, y, color }: { text: string; x: number; y: number; color?: string }
) => {
  ctx.save();
  ctx.beginPath();
  if (color) ctx.fillStyle = color;

  const measure: MeasureType = ctx.measureText(text);
  const actualHeight = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;
  const emHeight = measure?.emHeightAscent! - measure?.emHeightDescent!;

  ctx.fillRect(x - measure.actualBoundingBoxLeft, y + actualHeight - emHeight, measure.width, 1);
  ctx.fillText(text, x, y);

  ctx.restore();
};
