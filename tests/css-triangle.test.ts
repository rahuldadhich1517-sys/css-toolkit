import { describe, it, expect } from 'vitest';
import { generateTriangle, type TriangleDirection } from '../src/css-triangle/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-triangle', () => {
  const directions: TriangleDirection[] = [
    'up',
    'down',
    'left',
    'right',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ];

  for (const dir of directions) {
    it(`generates triangle in direction: ${dir}`, () => {
      const res = generateTriangle({
        direction: dir,
        width: 20,
        height: 10,
        color: '#ff0000',
        selector: '.arrow',
      });

      expect(res.direction).toBe(dir);
      expect(res.declarations['width']).toBe('0');
      expect(res.declarations['height']).toBe('0');
      expect(res.declarations['border-style']).toBe('solid');
      expect(res.declarations['border-color']).toContain('#ff0000');
      expect(res.css).toContain('.arrow {');
    });
  }

  it('rejects invalid dimensions or invalid color', () => {
    expect(() => generateTriangle({ width: 0 })).toThrow(CssToolkitError);
    expect(() => generateTriangle({ color: 'bad-color' })).toThrow(CssToolkitError);
  });
});
