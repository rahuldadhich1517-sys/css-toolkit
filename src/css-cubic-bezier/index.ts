import { CssToolkitError } from '../internal/errors/index.js';
import { validateNumber } from '../internal/validation/index.js';

export interface CubicBezierPoints {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export type CubicBezierPreset = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

export const CUBIC_BEZIER_PRESETS: Record<CubicBezierPreset, CubicBezierPoints> = {
  linear: { x1: 0.0, y1: 0.0, x2: 1.0, y2: 1.0 },
  ease: { x1: 0.25, y1: 0.1, x2: 0.25, y2: 1.0 },
  'ease-in': { x1: 0.42, y1: 0.0, x2: 1.0, y2: 1.0 },
  'ease-out': { x1: 0.0, y1: 0.0, x2: 0.58, y2: 1.0 },
  'ease-in-out': { x1: 0.42, y1: 0.0, x2: 0.58, y2: 1.0 },
};

export function validateCubicBezier(x1: number, y1: number, x2: number, y2: number): void {
  validateNumber(x1, 'x1', 0, 1);
  validateNumber(y1, 'y1');
  validateNumber(x2, 'x2', 0, 1);
  validateNumber(y2, 'y2');
}

export interface CubicBezierOptions {
  preset?: CubicBezierPreset;
  points?: CubicBezierPoints;
}

export interface CubicBezierResult {
  cubicBezier: string;
  css: string;
  points: CubicBezierPoints;
  getPreviewPoints: (samples?: number) => Array<{ t: number; x: number; y: number }>;
}

export function generateCubicBezier(options: CubicBezierOptions | CubicBezierPreset): CubicBezierResult {
  let points: CubicBezierPoints;

  if (typeof options === 'string') {
    const preset = CUBIC_BEZIER_PRESETS[options];
    if (!preset) {
      throw new CssToolkitError(`Unknown cubic-bezier preset: "${options}"`, 'INVALID_CUBIC_BEZIER');
    }
    points = preset;
  } else if (options.preset) {
    const preset = CUBIC_BEZIER_PRESETS[options.preset];
    if (!preset) {
      throw new CssToolkitError(`Unknown cubic-bezier preset: "${options.preset}"`, 'INVALID_CUBIC_BEZIER');
    }
    points = preset;
  } else if (options.points) {
    points = options.points;
  } else {
    points = CUBIC_BEZIER_PRESETS.ease;
  }

  validateCubicBezier(points.x1, points.y1, points.x2, points.y2);

  const str = `cubic-bezier(${points.x1}, ${points.y1}, ${points.x2}, ${points.y2})`;

  const getPreviewPoints = (samples = 20): Array<{ t: number; x: number; y: number }> => {
    const count = Math.max(2, samples);
    const pts: Array<{ t: number; x: number; y: number }> = [];
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const oneMinusT = 1 - t;
      // 1D Bernstein polynomials
      const x =
        3 * Math.pow(oneMinusT, 2) * t * points.x1 +
        3 * oneMinusT * Math.pow(t, 2) * points.x2 +
        Math.pow(t, 3);
      const y =
        3 * Math.pow(oneMinusT, 2) * t * points.y1 +
        3 * oneMinusT * Math.pow(t, 2) * points.y2 +
        Math.pow(t, 3);
      pts.push({
        t: Math.round(t * 1000) / 1000,
        x: Math.round(x * 1000) / 1000,
        y: Math.round(y * 1000) / 1000,
      });
    }
    return pts;
  };

  return {
    cubicBezier: str,
    css: `transition-timing-function: ${str};`,
    points,
    getPreviewPoints,
  };
}
