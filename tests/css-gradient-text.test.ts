import { describe, it, expect } from 'vitest';
import { generateGradientText } from '../src/index.js';

describe('css-gradient-text', () => {
  it('generates gradient text declarations with linear gradient', () => {
    const res = generateGradientText({
      type: 'linear',
      angle: 90,
      stops: ['#ff0000', '#0000ff'],
    });

    expect(res.gradient).toBe('linear-gradient(90deg, #ff0000, #0000ff)');
    expect(res.declarations['background-image']).toBe(res.gradient);
    expect(res.declarations['-webkit-background-clip']).toBe('text');
    expect(res.declarations['background-clip']).toBe('text');
    expect(res.declarations['-webkit-text-fill-color']).toBe('transparent');
    expect(res.declarations['color']).toBe('transparent');
    expect(res.css).toContain('background-image: linear-gradient(90deg, #ff0000, #0000ff);');
  });

  it('wraps css in selector when provided', () => {
    const res = generateGradientText({
      selector: '.title-grad',
      type: 'linear',
      angle: 45,
      stops: [
        { color: '#ff8800', position: '0%' },
        { color: '#e52e71', position: '100%' },
      ],
    });

    expect(res.css).toContain('.title-grad {');
    expect(res.css).toContain('  background-clip: text;');
    expect(res.css).toContain('}');
  });
});
