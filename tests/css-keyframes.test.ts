import { describe, it, expect } from 'vitest';
import { generateKeyframes } from '../src/css-keyframes/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-keyframes', () => {
  it('generates keyframes with percentages and animation declaration', () => {
    const res = generateKeyframes({
      name: 'fadeInUp',
      keyframes: {
        '0%': { opacity: 0, transform: 'translateY(20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
      animation: {
        duration: '0.5s',
        timingFunction: 'ease-out',
        fillMode: 'forwards',
      },
    });

    expect(res.keyframesCss).toContain('@keyframes fadeInUp {');
    expect(res.keyframesCss).toContain('0% {');
    expect(res.keyframesCss).toContain('opacity: 0;');
    expect(res.keyframesCss).toContain('100% {');
    expect(res.animationDeclaration).toBe('animation: fadeInUp 0.5s ease-out 0s infinite normal forwards running;');
    expect(res.css).toContain('@keyframes fadeInUp');
    expect(res.css).toContain('animation: fadeInUp');
  });

  it('supports from/to syntax', () => {
    const res = generateKeyframes({
      name: 'pulse',
      keyframes: {
        from: { transform: 'scale(1)' },
        to: { transform: 'scale(1.1)' },
      },
    });
    expect(res.keyframesCss).toContain('from {');
    expect(res.keyframesCss).toContain('to {');
  });

  it('rejects invalid stop keys or invalid identifiers', () => {
    expect(() =>
      generateKeyframes({
        name: 'test',
        keyframes: {
          '150%': { opacity: 1 },
        },
      })
    ).toThrow(CssToolkitError);

    expect(() =>
      generateKeyframes({
        name: '123-bad name!',
        keyframes: { from: { opacity: 0 } },
      })
    ).toThrow(CssToolkitError);
  });
});
