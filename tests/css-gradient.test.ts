import { describe, it, expect } from 'vitest';
import { generateGradient } from '../src/css-gradient/index.js';
import { generateGradientText } from '../src/css-gradient-text/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-gradient and css-gradient-text', () => {
  it('generates linear gradients with angles, directions, and stops', () => {
    const resAngle = generateGradient({
      type: 'linear',
      angle: 90,
      stops: ['#ff0000', '#0000ff'],
    });
    expect(resAngle.gradient).toBe('linear-gradient(90deg, #ff0000, #0000ff)');
    expect(resAngle.css).toBe('background-image: linear-gradient(90deg, #ff0000, #0000ff);');

    const resDir = generateGradient({
      type: 'linear',
      direction: 'to bottom right',
      stops: [
        { color: '#ff0000', position: '0%' },
        { color: '#00ff00', position: '50%' },
        { color: '#0000ff', position: '100%' },
      ],
    });
    expect(resDir.gradient).toBe('linear-gradient(to bottom right, #ff0000 0%, #00ff00 50%, #0000ff 100%)');
  });

  it('generates radial and conic gradients', () => {
    const resRadial = generateGradient({
      type: 'radial',
      shape: 'circle',
      position: 'center',
      stops: ['#fff', '#000'],
    });
    expect(resRadial.gradient).toBe('radial-gradient(circle at center, #ffffff, #000000)');

    const resConic = generateGradient({
      type: 'conic',
      angle: 45,
      stops: ['#ff0000', '#0000ff'],
    });
    expect(resConic.gradient).toBe('conic-gradient(from 45deg, #ff0000, #0000ff)');
  });

  it('generates gradient text with background-clip and transparent text fill', () => {
    const resText = generateGradientText({
      angle: 45,
      stops: ['#f43f5e', '#8b5cf6'],
      selector: '.gradient-heading',
    });

    expect(resText.declarations['background-image']).toContain('linear-gradient');
    expect(resText.declarations['-webkit-background-clip']).toBe('text');
    expect(resText.declarations['background-clip']).toBe('text');
    expect(resText.declarations['-webkit-text-fill-color']).toBe('transparent');
    expect(resText.declarations['color']).toBe('transparent');
    expect(resText.css).toContain('.gradient-heading {');
  });

  it('rejects fewer than 2 stops', () => {
    expect(() =>
      generateGradient({
        stops: ['#ff0000'],
      })
    ).toThrow(CssToolkitError);
  });
});
