import { describe, it, expect } from 'vitest';
import { generateTransform } from '../src/css-transform/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-transform', () => {
  it('generates ordered transform functions preserving exact order', () => {
    const res = generateTransform([
      { type: 'translate', value: [10, 20] },
      { type: 'rotate', value: 45 },
      { type: 'scale', value: [1.2, 1.2] },
      { type: 'skewX', value: 10 },
    ]);

    expect(res.transform).toBe('translate(10px, 20px) rotate(45deg) scale(1.2, 1.2) skewX(10deg)');
    expect(res.css).toBe(`transform: ${res.transform};`);
  });

  it('supports 3D transform functions and matrix', () => {
    const res3d = generateTransform([
      { type: 'translate3d', value: [10, 20, 30] },
      { type: 'rotateY', value: '180deg' },
    ]);
    expect(res3d.transform).toBe('translate3d(10px, 20px, 30px) rotateY(180deg)');

    const resMatrix = generateTransform([
      { type: 'matrix', value: [1, 0, 0, 1, 50, 50] },
    ]);
    expect(resMatrix.transform).toBe('matrix(1, 0, 0, 1, 50, 50)');
  });

  it('supports object syntax with transformOrigin and selector', () => {
    const res = generateTransform({
      translateX: 15,
      rotate: 90,
      transformOrigin: 'top left',
      selector: '.rotated',
    });

    expect(res.transform).toBe('translateX(15px) rotate(90deg)');
    expect(res.transformOrigin).toBe('top left');
    expect(res.css).toContain('.rotated {');
    expect(res.css).toContain('transform-origin: top left;');
  });

  it('rejects malformed matrix inputs', () => {
    expect(() =>
      generateTransform([{ type: 'matrix', value: [1, 2] }])
    ).toThrow(CssToolkitError);
  });
});
