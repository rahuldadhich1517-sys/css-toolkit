import { describe, it, expect } from 'vitest';
import {
  generateCubicBezier,
  validateCubicBezier,
  CUBIC_BEZIER_PRESETS,
} from '../src/css-cubic-bezier/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-cubic-bezier', () => {
  it('generates easing presets correctly', () => {
    for (const [name, expectedPoints] of Object.entries(CUBIC_BEZIER_PRESETS)) {
      const res = generateCubicBezier(name as any);
      expect(res.points).toEqual(expectedPoints);
      expect(res.cubicBezier).toBe(
        `cubic-bezier(${expectedPoints.x1}, ${expectedPoints.y1}, ${expectedPoints.x2}, ${expectedPoints.y2})`
      );
    }
  });

  it('generates preview coordinates for graph rendering', () => {
    const res = generateCubicBezier('linear');
    const preview = res.getPreviewPoints(10);
    expect(preview.length).toBe(11); // 0..10
    expect(preview[0]?.x).toBe(0);
    expect(preview[0]?.y).toBe(0);
    expect(preview[10]?.x).toBe(1);
    expect(preview[10]?.y).toBe(1);
  });

  it('validates X coordinates within [0, 1] and allows overshoot for Y', () => {
    expect(() => validateCubicBezier(-0.1, 0, 1, 1)).toThrow(CssToolkitError);
    expect(() => validateCubicBezier(0, 0, 1.2, 1)).toThrow(CssToolkitError);
    expect(() => validateCubicBezier(NaN, 0, 1, 1)).toThrow(CssToolkitError);
    expect(() => validateCubicBezier(0, 0, Infinity, 1)).toThrow(CssToolkitError);

    // Overshoot Y is valid in CSS (bounce effects)
    expect(() => validateCubicBezier(0.2, -0.5, 0.8, 1.5)).not.toThrow();
  });
});
