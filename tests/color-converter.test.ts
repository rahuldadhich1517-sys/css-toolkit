import { describe, it, expect } from 'vitest';
import {
  convertColor,
  parseColor,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
} from '../src/color-converter/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('color-converter', () => {
  it('converts 3, 4, 6, 8 digit HEX to RGB', () => {
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0, a: 1 });
    expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255, a: 1 });
    expect(hexToRgb('#ff000080').a).toBeCloseTo(0.5, 1);
    expect(hexToRgb('#f008').a).toBeCloseTo(0.53, 1);
  });

  it('converts RGB to HEX', () => {
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    expect(rgbToHex({ r: 255, g: 0, b: 128 })).toBe('#ff0080');
    expect(rgbToHex({ r: 255, g: 0, b: 128, a: 0.5 })).toBe('#ff008080');
  });

  it('converts RGB to HSL and back', () => {
    const redHsl = rgbToHsl({ r: 255, g: 0, b: 0 });
    expect(redHsl.h).toBe(0);
    expect(redHsl.s).toBe(100);
    expect(redHsl.l).toBe(50);

    const backRgb = hslToRgb(redHsl);
    expect(backRgb.r).toBe(255);
    expect(backRgb.g).toBe(0);
    expect(backRgb.b).toBe(0);

    const greenHsl = rgbToHsl({ r: 0, g: 255, b: 0 });
    expect(greenHsl.h).toBe(120);
    expect(greenHsl.s).toBe(100);
    expect(greenHsl.l).toBe(50);

    const blueHsl = rgbToHsl({ r: 0, g: 0, b: 255 });
    expect(blueHsl.h).toBe(240);
    expect(blueHsl.s).toBe(100);
    expect(blueHsl.l).toBe(50);

    // Grayscale / Black / White
    const grayHsl = rgbToHsl({ r: 128, g: 128, b: 128 });
    expect(grayHsl.s).toBe(0);
    expect(grayHsl.l).toBeCloseTo(50.2, 1);
  });

  it('handles percentage RGB and modern space-separated syntax', () => {
    const p1 = parseColor('rgb(100%, 0%, 0%)');
    expect(p1.rgb).toEqual({ r: 255, g: 0, b: 0, a: 1 });

    const p2 = parseColor('rgb(255 128 0 / 50%)');
    expect(p2.rgb.r).toBe(255);
    expect(p2.rgb.g).toBe(128);
    expect(p2.rgb.b).toBe(0);
    expect(p2.alpha).toBe(0.5);
  });

  it('handles modern HSL syntax with degrees, turns, rads', () => {
    const h1 = parseColor('hsl(180deg, 50%, 50%)');
    expect(h1.hsl.h).toBe(180);

    const h2 = parseColor('hsl(0.5turn, 50%, 50%)');
    expect(h2.hsl.h).toBe(180);

    const h3 = parseColor('hsl(180 50% 50% / 0.8)');
    expect(h3.alpha).toBe(0.8);
  });

  it('parses named colors', () => {
    const p = parseColor('transparent');
    expect(p.alpha).toBe(0);
    const pRed = parseColor('red');
    expect(pRed.hex).toBe('#ff0000');
  });

  it('formats colors correctly with convertColor', () => {
    expect(convertColor('#ff0000', { format: 'hex' })).toBe('#ff0000');
    expect(convertColor('#ff0000', { format: 'rgb' })).toBe('rgb(255, 0, 0)');
    expect(convertColor('rgba(255, 0, 0, 0.5)', { format: 'rgba' })).toBe('rgba(255, 0, 0, 0.5)');
    expect(convertColor('#ff0000', { format: 'hsl' })).toBe('hsl(0, 100%, 50%)');
    expect(convertColor('rgba(255, 0, 0, 0.5)', { format: 'hsla' })).toBe('hsla(0, 100%, 50%, 0.5)');
  });

  it('supports clamp option when specified', () => {
    const clamped = parseColor('rgb(300, -20, 100)', { clamp: true });
    expect(clamped.rgb.r).toBe(255);
    expect(clamped.rgb.g).toBe(0);
    expect(clamped.rgb.b).toBe(100);
  });

  it('rejects invalid, malformed, or out-of-range colors by default', () => {
    expect(() => parseColor('rgb(300, 0, 0)')).toThrow(CssToolkitError);
    expect(() => parseColor('invalid-color')).toThrow(CssToolkitError);
    expect(() => parseColor('#xyz')).toThrow(CssToolkitError);
    expect(() => parseColor('')).toThrow(CssToolkitError);
    expect(() => parseColor('hsl(100, 50, 50)')).toThrow(CssToolkitError); // missing %
    expect(() => parseColor({ invalid: true } as any)).toThrow(CssToolkitError);
  });
});
