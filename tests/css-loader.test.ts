import { describe, it, expect } from 'vitest';
import { generateLoader, type LoaderType } from '../src/css-loader/index.js';

describe('css-loader', () => {
  const types: LoaderType[] = ['spinner', 'dots', 'pulse', 'bars', 'ring', 'bouncing'];

  for (const type of types) {
    it(`generates loader preset: ${type}`, () => {
      const res = generateLoader({
        type,
        size: 50,
        color: '#10b981',
        speed: '1.2s',
        reducedMotion: true,
      });

      expect(res.type).toBe(type);
      expect(res.html).toContain('loader-');
      expect(res.css).toContain(`@keyframes loader-${type}`);
      expect(res.css).toContain('prefers-reduced-motion: reduce');
    });
  }

  it('supports custom class names and dot counts', () => {
    const res = generateLoader({
      type: 'dots',
      className: 'custom-dots',
      items: 4,
    });
    expect(res.html).toContain('custom-dots');
    expect(res.html.match(/custom-dots__dot/g)?.length).toBe(4);
  });
});
