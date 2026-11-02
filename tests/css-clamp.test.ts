import { describe, it, expect } from 'vitest';
import { generateClamp } from '../src/css-clamp/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-clamp', () => {
  it('generates valid fluid clamp in rem', () => {
    const res = generateClamp({
      minSize: 16,
      maxSize: 32,
      minViewport: 320,
      maxViewport: 1120,
      rootFontSize: 16,
      unit: 'rem',
    });

    expect(res.min).toBe('1rem');
    expect(res.max).toBe('2rem');
    expect(res.clamp).toContain('clamp(1rem,');
    expect(res.clamp).toContain('vw)');
    expect(res.css).toBe(`font-size: ${res.clamp};`);

    // Verification at viewports:
    // At minViewport (320), should evaluate to 1rem
    expect(res.evaluateAt(320)).toBe(1);
    // At maxViewport (1120), should evaluate to 2rem
    expect(res.evaluateAt(1120)).toBe(2);
    // At midpoint (720), should evaluate to 1.5rem
    expect(res.evaluateAt(720)).toBe(1.5);
    // Outside bounds (clamped)
    expect(res.evaluateAt(200)).toBe(1);
    expect(res.evaluateAt(1500)).toBe(2);
  });

  it('generates fluid clamp in px', () => {
    const res = generateClamp({
      minSize: 16,
      maxSize: 32,
      minViewport: 400,
      maxViewport: 1200,
      unit: 'px',
    });

    expect(res.min).toBe('16px');
    expect(res.max).toBe('32px');
    expect(res.clamp).toContain('px');
    expect(res.evaluateAt(400)).toBe(16);
    expect(res.evaluateAt(1200)).toBe(32);
    expect(res.evaluateAt(800)).toBe(24);
  });

  it('rejects invalid or reversed viewport bounds', () => {
    expect(() =>
      generateClamp({
        minSize: 16,
        maxSize: 32,
        minViewport: 1000,
        maxViewport: 500,
      })
    ).toThrow(CssToolkitError);

    expect(() =>
      generateClamp({
        minSize: 16,
        maxSize: 32,
        minViewport: 500,
        maxViewport: 500, // division by zero prevention
      })
    ).toThrow(CssToolkitError);
  });
});
