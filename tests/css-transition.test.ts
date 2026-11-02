import { describe, it, expect } from 'vitest';
import { generateTransition } from '../src/css-transition/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-transition', () => {
  it('generates single transition shorthand', () => {
    const res = generateTransition({
      property: 'opacity',
      duration: 0.25,
      timingFunction: 'ease-in-out',
      delay: 0.1,
    });
    expect(res.transition).toBe('opacity 0.25s ease-in-out 0.1s');
    expect(res.css).toBe('transition: opacity 0.25s ease-in-out 0.1s;');
  });

  it('generates multiple transition declarations', () => {
    const res = generateTransition({
      transitions: [
        { property: 'opacity', duration: '0.2s' },
        { property: 'transform', duration: 0.4, timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      ],
      selector: '.animated-btn',
    });

    expect(res.transition).toBe('opacity 0.2s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)');
    expect(res.css).toContain('.animated-btn {');
    expect(res.css).toContain('transition: opacity 0.2s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);');
  });

  it('rejects negative duration or invalid property', () => {
    expect(() =>
      generateTransition({
        property: 'opacity',
        duration: -1,
      })
    ).toThrow(CssToolkitError);

    expect(() =>
      generateTransition({
        property: '123 invalid prop',
      })
    ).toThrow(CssToolkitError);
  });
});
