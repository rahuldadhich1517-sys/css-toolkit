import { describe, it, expect } from 'vitest';
import { generateBoxShadow } from '../src/css-box-shadow/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-box-shadow', () => {
  it('generates a single box shadow layer', () => {
    const res = generateBoxShadow({
      x: 0,
      y: 4,
      blur: 8,
      spread: 2,
      color: 'rgba(0, 0, 0, 0.1)',
    });
    expect(res.boxShadow).toBe('0 4px 8px 2px rgba(0, 0, 0, 0.1)');
    expect(res.css).toBe('box-shadow: 0 4px 8px 2px rgba(0, 0, 0, 0.1);');
  });

  it('supports inset shadows and negative offsets/spread', () => {
    const res = generateBoxShadow({
      x: -2,
      y: -4,
      blur: 0,
      spread: -1,
      inset: true,
      color: '#ff0000',
    });
    expect(res.boxShadow).toBe('inset -2px -4px 0 -1px #ff0000');
  });

  it('handles multiple layers preserving order', () => {
    const res = generateBoxShadow([
      { x: 0, y: 1, blur: 2, color: 'rgba(0, 0, 0, 0.05)' },
      { x: 0, y: 4, blur: 8, color: 'rgba(0, 0, 0, 0.1)' },
    ]);
    expect(res.boxShadow).toBe('0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 4px 8px 0 rgba(0, 0, 0, 0.1)');
  });

  it('handles empty layers list', () => {
    const res = generateBoxShadow([]);
    expect(res.boxShadow).toBe('none');
    expect(res.css).toBe('box-shadow: none;');
  });

  it('rejects invalid colors or non-object layers', () => {
    expect(() => generateBoxShadow({ color: 'not-a-color' })).toThrow(CssToolkitError);
    expect(() => generateBoxShadow(null as any)).toThrow(CssToolkitError);
  });
});
