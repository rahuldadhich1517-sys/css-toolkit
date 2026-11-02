import { describe, it, expect } from 'vitest';
import { generateBorderRadius } from '../src/css-border-radius/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-border-radius', () => {
  it('generates uniform border radius', () => {
    const res = generateBorderRadius({ radius: 8 });
    expect(res.borderRadius).toBe('8px');
    expect(res.css).toBe('border-radius: 8px;');
  });

  it('generates 4 corner radius with shorthand compaction', () => {
    const resAllSame = generateBorderRadius({
      radius: { topLeft: 10, topRight: 10, bottomRight: 10, bottomLeft: 10 },
    });
    expect(resAllSame.borderRadius).toBe('10px');

    const resTwoValues = generateBorderRadius({
      radius: { topLeft: 10, topRight: 20, bottomRight: 10, bottomLeft: 20 },
    });
    expect(resTwoValues.borderRadius).toBe('10px 20px');

    const resFourValues = generateBorderRadius({
      radius: { topLeft: 10, topRight: 20, bottomRight: 30, bottomLeft: 40 },
    });
    expect(resFourValues.borderRadius).toBe('10px 20px 30px 40px');
  });

  it('generates elliptical border radius (horizontal / vertical)', () => {
    const res = generateBorderRadius({
      elliptical: {
        horizontal: 20,
        vertical: 10,
      },
    });
    expect(res.borderRadius).toBe('20px / 10px');
    expect(res.css).toBe('border-radius: 20px / 10px;');
  });

  it('supports squircle output with corner-shape', () => {
    const res = generateBorderRadius({ radius: 16, squircle: true });
    expect(res.cornerShape).toBe('squircle');
    expect(res.declarations['corner-shape']).toBe('squircle');
    expect(res.css).toContain('corner-shape: squircle;');
  });

  it('rejects negative or invalid radius values', () => {
    expect(() => generateBorderRadius({ radius: -5 })).toThrow(CssToolkitError);
  });
});
