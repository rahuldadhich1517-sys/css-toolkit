import { describe, it, expect } from 'vitest';
import { generateMediaQuery } from '../src/css-media-query/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-media-query', () => {
  it('generates media queries with breakpoints, orientations, and reduced motion', () => {
    const res = generateMediaQuery({
      preset: 'md',
      maxWidth: 1200,
      orientation: 'landscape',
      prefersReducedMotion: 'no-preference',
      selector: '.container',
      declarations: { maxWidth: '1000px' },
    });

    expect(res.mediaQuery).toBe('@media (min-width: 768px) and (max-width: 1200px) and (orientation: landscape) and (prefers-reduced-motion: no-preference)');
    expect(res.css).toContain('.container {');
    expect(res.css).toContain('max-width: 1000px;');
  });

  it('supports print and screen media types', () => {
    const printRes = generateMediaQuery({
      mediaType: 'print',
      declarations: { display: 'none' },
      selector: '.sidebar',
    });
    expect(printRes.mediaQuery).toBe('@media print');
    expect(printRes.css).toContain('.sidebar {');
  });

  it('rejects empty query options without conditions or mediaType', () => {
    expect(() => generateMediaQuery({})).toThrow(CssToolkitError);
  });
});
