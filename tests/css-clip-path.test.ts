import { describe, it, expect } from 'vitest';
import { generateClipPath } from '../src/css-clip-path/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-clip-path', () => {
  it('generates polygon clip-path with >= 3 points', () => {
    const res = generateClipPath({
      shape: 'polygon',
      points: [
        [50, 0],
        [0, 100],
        [100, 100],
      ],
    });
    expect(res.clipPath).toBe('polygon(50% 0%, 0% 100%, 100% 100%)');
    expect(res.css).toBe('clip-path: polygon(50% 0%, 0% 100%, 100% 100%);');
  });

  it('supports point objects in polygon', () => {
    const res = generateClipPath({
      shape: 'polygon',
      points: [
        { x: '10px', y: '20px' },
        { x: '30px', y: '40px' },
        { x: '50px', y: '60px' },
      ],
    });
    expect(res.clipPath).toBe('polygon(10px 20px, 30px 40px, 50px 60px)');
  });

  it('generates circle clip-path with radius and position', () => {
    const res = generateClipPath({
      shape: 'circle',
      radius: '40px',
      at: { x: '50%', y: '50%' },
    });
    expect(res.clipPath).toBe('circle(40px at 50% 50%)');
  });

  it('generates ellipse clip-path', () => {
    const res = generateClipPath({
      shape: 'ellipse',
      rx: '25%',
      ry: '40%',
      at: { x: '50%', y: '50%' },
    });
    expect(res.clipPath).toBe('ellipse(25% 40% at 50% 50%)');
  });

  it('generates inset clip-path with optional rounded corners', () => {
    const res = generateClipPath({
      shape: 'inset',
      top: 10,
      right: 20,
      bottom: 30,
      left: 40,
      round: '5px',
    });
    expect(res.clipPath).toBe('inset(10% 20% 30% 40% round 5px)');
  });

  it('throws on polygon with fewer than 3 points', () => {
    expect(() =>
      generateClipPath({
        shape: 'polygon',
        points: [[0, 0], [10, 10]],
      })
    ).toThrow(CssToolkitError);
  });
});
