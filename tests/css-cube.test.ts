import { describe, it, expect } from 'vitest';
import { generateCssCube } from '../src/css-cube/index.js';

describe('css-cube', () => {
  it('generates 3D CSS cube with 6 faces and transformations', () => {
    const res = generateCssCube({
      size: 120,
      perspective: 1000,
      className: 'my-cube',
      animate: true,
      animationDuration: '8s',
    });

    expect(res.faces).toEqual(['front', 'back', 'right', 'left', 'top', 'bottom']);
    expect(res.html).toContain('<div class="my-cube-scene">');
    expect(res.html).toContain('my-cube__face--front');
    expect(res.css).toContain('perspective: 1000px;');
    expect(res.css).toContain('transform-style: preserve-3d;');
    expect(res.css).toContain('.my-cube__face--front');
    expect(res.css).toContain('.my-cube__face--back');
    expect(res.css).toContain('@keyframes my-cube-rotate');
  });

  it('escapes unsafe HTML content on cube faces', () => {
    const res = generateCssCube({
      faceContent: {
        front: '<script>alert("hack")</script>',
      },
    });

    expect(res.html).not.toContain('<script>');
    expect(res.html).toContain('&lt;script&gt;');
  });
});
