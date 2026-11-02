import type { RgbColor } from './types.js';

export interface LabColor {
  l: number;
  a: number;
  b: number;
}

// Convert sRGB to linear RGB
function sRgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

// sRGB to XYZ (D65 reference white)
export function rgbToXyz(rgb: RgbColor): { x: number; y: number; z: number } {
  const r = sRgbToLinear(rgb.r);
  const g = sRgbToLinear(rgb.g);
  const b = sRgbToLinear(rgb.b);

  const x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) * 100;
  const y = (r * 0.2126729 + g * 0.7151522 + b * 0.072175) * 100;
  const z = (r * 0.0193339 + g * 0.119192 + b * 0.9503041) * 100;

  return { x, y, z };
}

function fLab(t: number): number {
  return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
}

// XYZ (D65: Xn=95.047, Yn=100.0, Zn=108.883) to CIELAB
export function xyzToLab(xyz: { x: number; y: number; z: number }): LabColor {
  const xn = 95.047;
  const yn = 100.0;
  const zn = 108.883;

  const fx = fLab(xyz.x / xn);
  const fy = fLab(xyz.y / yn);
  const fz = fLab(xyz.z / zn);

  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return { l, a, b };
}

export function rgbToLab(rgb: RgbColor): LabColor {
  return xyzToLab(rgbToXyz(rgb));
}

// Perceptual distance (Delta E CIE76)
export function deltaE(c1: LabColor, c2: LabColor): number {
  const dl = c1.l - c2.l;
  const da = c1.a - c2.a;
  const db = c1.b - c2.b;
  return Math.sqrt(dl * dl + da * da + db * db);
}
