import { describe, it, expect } from 'vitest';
import { convertCssUnit } from '../src/css-unit-convert/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-unit-convert', () => {
  it('converts px to rem and rem to px using rootFontSize', () => {
    expect(convertCssUnit(16, 'px', 'rem', { rootFontSize: 16 })).toBe(1);
    expect(convertCssUnit(32, 'px', 'rem', { rootFontSize: 16 })).toBe(2);
    expect(convertCssUnit(1.5, 'rem', 'px', { rootFontSize: 16 })).toBe(24);
  });

  it('converts em using parentFontSize', () => {
    expect(convertCssUnit(24, 'px', 'em', { parentFontSize: 12 })).toBe(2);
    expect(convertCssUnit(2, 'em', 'px', { parentFontSize: 14 })).toBe(28);
  });

  it('converts % using referenceDimension', () => {
    expect(convertCssUnit(50, '%', 'px', { referenceDimension: 800 })).toBe(400);
    expect(convertCssUnit(200, 'px', '%', { referenceDimension: 1000 })).toBe(20);
  });

  it('converts vw, vh, vmin, vmax using viewport context', () => {
    const ctx = { viewportWidth: 1000, viewportHeight: 800 };
    expect(convertCssUnit(10, 'vw', 'px', ctx)).toBe(100);
    expect(convertCssUnit(20, 'vh', 'px', ctx)).toBe(160);
    // vmin is min(1000, 800) = 800
    expect(convertCssUnit(50, 'vmin', 'px', ctx)).toBe(400);
    // vmax is max(1000, 800) = 1000
    expect(convertCssUnit(50, 'vmax', 'px', ctx)).toBe(500);
  });

  it('preserves value when fromUnit equals toUnit', () => {
    expect(convertCssUnit(42, 'px', 'px')).toBe(42);
    expect(convertCssUnit(1.5, 'rem', 'rem')).toBe(1.5);
  });

  it('throws MISSING_CONTEXT when context-dependent conversions lack context', () => {
    expect(() => convertCssUnit(10, 'em', 'px')).toThrow(CssToolkitError);
    expect(() => convertCssUnit(50, '%', 'px')).toThrow(CssToolkitError);
    expect(() => convertCssUnit(10, 'vw', 'px')).toThrow(CssToolkitError);
    expect(() => convertCssUnit(10, 'vh', 'px')).toThrow(CssToolkitError);
  });

  it('throws INVALID_UNIT for unsupported unit names', () => {
    expect(() => convertCssUnit(10, 'px', 'pt' as any)).toThrow(CssToolkitError);
  });
});
