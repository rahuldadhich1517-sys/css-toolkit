import { describe, it, expect } from 'vitest';
import { generateCss } from '../src/css-generator/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-generator', () => {
  it('generates a single rule with formatted declarations', () => {
    const css = generateCss({
      selector: '.button',
      declarations: {
        backgroundColor: '#ff0000',
        padding: '12px 16px',
        borderRadius: '4px',
      },
    });

    expect(css).toContain('.button {');
    expect(css).toContain('background-color: #ff0000;');
    expect(css).toContain('padding: 12px 16px;');
    expect(css).toContain('border-radius: 4px;');
  });

  it('supports multiple selectors and comments', () => {
    const css = generateCss(
      {
        selector: ['.btn', '.btn-primary'],
        declarations: { color: 'white' },
        comment: 'Button primary',
      },
      { comment: 'UI Kit' }
    );

    expect(css).toContain('/* UI Kit */');
    expect(css).toContain('/* Button primary */');
    expect(css).toContain('.btn, .btn-primary {');
  });

  it('supports media queries and pseudo classes', () => {
    const css = generateCss([
      {
        selector: '.card',
        declarations: { width: '100%' },
      },
      {
        selector: '.card',
        media: '(min-width: 768px)',
        declarations: { width: '50%' },
      },
      {
        selector: '.card',
        pseudo: ':hover',
        declarations: { opacity: 0.9 },
      },
    ]);

    expect(css).toContain('.card {');
    expect(css).toContain('.card:hover {');
    expect(css).toContain('@media (min-width: 768px) {');
    expect(css).toContain('width: 50%;');
  });

  it('handles empty input and empty declarations', () => {
    expect(generateCss([])).toBe('');
    expect(generateCss({ selector: '.empty', declarations: {} })).toContain('.empty {}');
  });

  it('throws on invalid selector or unsafe input', () => {
    expect(() => generateCss({ selector: '', declarations: {} })).toThrow(CssToolkitError);
    expect(() => generateCss({ selector: '.box', declarations: { content: '<script>alert(1)</script>' } })).toThrow(
      CssToolkitError
    );
  });
});
