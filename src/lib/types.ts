import { TextMetrics } from 'canvas';

export type MeasureType = TextMetrics & {
  emHeightAscent?: number;
  emHeightDescent?: number;
  alphabeticBaseline?: number;
};
