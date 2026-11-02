export interface RgbColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';

export interface ConvertColorOptions {
  format?: ColorFormat;
  precision?: number;
  clamp?: boolean;
}

export interface ParsedColor {
  rgb: RgbColor;
  hsl: HslColor;
  hex: string;
  alpha: number;
}
