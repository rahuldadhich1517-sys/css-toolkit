import { describe, it, expect } from 'vitest';
import { generateFilter } from '../src/css-filter/index.js';

describe('css-filter', () => {
  it('generates single and multiple filter functions in ordered chain', () => {
    const res = generateFilter([
      { type: 'blur', value: 5 },
      { type: 'brightness', value: 1.2 },
      { type: 'contrast', value: '150%' },
      { type: 'hueRotate', value: 90 },
      { type: 'dropShadow', value: { x: 2, y: 4, blur: 6, color: '#000000' } },
    ]);

    expect(res.filter).toBe('blur(5px) brightness(1.2) contrast(150%) hue-rotate(90deg) drop-shadow(2px 4px 6px #000000)');
    expect(res.css).toBe(`filter: ${res.filter};`);
  });

  it('supports object syntax', () => {
    const res = generateFilter({
      grayscale: '100%',
      sepia: 0.5,
      invert: '80%',
      opacity: 0.9,
      saturate: 2,
    });
    expect(res.filter).toContain('grayscale(100%)');
    expect(res.filter).toContain('sepia(0.5)');
    expect(res.filter).toContain('invert(80%)');
    expect(res.filter).toContain('opacity(0.9)');
    expect(res.filter).toContain('saturate(2)');
  });

  it('returns none on empty filter chain', () => {
    expect(generateFilter([])?.filter).toBe('none');
    expect(generateFilter({})?.filter).toBe('none');
  });
});
