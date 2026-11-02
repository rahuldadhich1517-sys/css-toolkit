import { describe, it, expect } from 'vitest';
import { generateGrid } from '../src/css-grid/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-grid', () => {
  it('generates standard grid layouts with columns, rows, and gaps', () => {
    const res = generateGrid({
      columns: 3,
      rows: ['100px', '1fr', 'auto'],
      gap: 16,
      alignItems: 'center',
    });

    expect(res.declarations['display']).toBe('grid');
    expect(res.declarations['grid-template-columns']).toBe('repeat(3, 1fr)');
    expect(res.declarations['grid-template-rows']).toBe('100px 1fr auto');
    expect(res.declarations['gap']).toBe('16px');
    expect(res.declarations['align-items']).toBe('center');
  });

  it('supports grid areas and auto-flow', () => {
    const res = generateGrid({
      areas: ['header header', 'sidebar content', 'footer footer'],
      autoFlow: 'row dense',
      inline: true,
      selector: '.dashboard-grid',
    });

    expect(res.declarations['display']).toBe('inline-grid');
    expect(res.declarations['grid-template-areas']).toBe('"header header" "sidebar content" "footer footer"');
    expect(res.declarations['grid-auto-flow']).toBe('row dense');
    expect(res.css).toContain('.dashboard-grid {');
  });

  it('rejects invalid tracks', () => {
    expect(() => generateGrid({ columns: -1 })).toThrow(CssToolkitError);
    expect(() => generateGrid({ columns: [] })).toThrow(CssToolkitError);
  });
});
