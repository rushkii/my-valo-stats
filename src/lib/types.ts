import { TextMetrics } from 'canvas';

export type MeasureType = TextMetrics & {
  emHeightAscent?: number;
  emHeightDescent?: number;
  alphabeticBaseline?: number;
};

export interface DrawRoundedRectOpts {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}
