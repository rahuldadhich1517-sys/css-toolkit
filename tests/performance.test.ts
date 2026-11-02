import { describe, it, expect } from 'vitest';
import {
  generateCss,
  beautifyCss,
  minifyCss,
  calculateSpecificity,
  generateGradient,
  generateKeyframes,
  tailwindToCss,
} from '../src/index.js';

describe('Performance Regression Tests', () => {
  it('handles large CSS stylesheets efficiently', () => {
    const rules = Array.from({ length: 500 }, (_, i) => ({
      selector: `.item-${i}`,
      declarations: {
        color: `#${(i % 16).toString(16).repeat(6)}`,
        margin: `${i}px`,
        padding: `${i * 2}px`,
      },
    }));

    const start = performance.now();
    const css = generateCss(rules);
    const genTime = performance.now() - start;

    expect(css.length).toBeGreaterThan(10000);
    expect(genTime).toBeLessThan(1000); // well under 1s for 500 rules

    const bStart = performance.now();
    const beautified = beautifyCss(css);
    const bTime = performance.now() - bStart;
    expect(beautified.length).toBeGreaterThan(10000);
    expect(bTime).toBeLessThan(2000);

    const mStart = performance.now();
    const minified = minifyCss(css);
    const mTime = performance.now() - mStart;
    expect(minified.length).toBeLessThan(css.length);
    expect(mTime).toBeLessThan(2000);
  });

  it('handles large selector lists in specificity calculations', () => {
    const selectors = Array.from({ length: 200 }, (_, i) => `.nav > .item-${i}#btn-${i}:hover`).join(', ');

    const start = performance.now();
    const spec = calculateSpecificity(selectors);
    const time = performance.now() - start;

    expect(spec.ids).toBe(1);
    expect(time).toBeLessThan(500);
  });

  it('handles many gradient stops and many keyframe stops', () => {
    const stops = Array.from({ length: 50 }, (_, i) => ({
      color: `#${((i * 5) % 256).toString(16).padStart(2, '0').repeat(3)}`,
      position: `${i * 2}%`,
    }));

    const grad = generateGradient({ stops });
    expect(grad.gradient).toContain('linear-gradient');

    const keyframeStops: Record<string, Record<string, string>> = {};
    for (let i = 0; i <= 100; i += 2) {
      keyframeStops[`${i}%`] = { opacity: String(i / 100) };
    }

    const kf = generateKeyframes({ name: 'smoothFade', keyframes: keyframeStops });
    expect(kf.keyframesCss).toContain('@keyframes smoothFade');
  });

  it('handles large Tailwind utility lists', async () => {
    const twClasses = [
      'p-1', 'p-2', 'p-4', 'p-6', 'p-8',
      'm-1', 'm-2', 'm-4', 'm-6', 'm-8',
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl',
      'flex', 'grid', 'hidden', 'block',
      'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-full'
    ];

    const start = performance.now();
    const res = await tailwindToCss(twClasses);
    const time = performance.now() - start;

    expect(res.css).toContain('.p-4');
    expect(res.css).toContain('.bg-red-500');
    expect(time).toBeLessThan(5000);
  });
});
