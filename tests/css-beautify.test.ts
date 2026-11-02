import { describe, it, expect } from 'vitest';
import { beautifyCss } from '../src/css-beautify/index.js';
import { minifyCss } from '../src/css-minify/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-beautify and css-minify', () => {
  const sampleCss = `
    /* header comment */
    .button, .btn {
      color: #fff;
      background-color: var(--primary-bg, blue);
      font-size: 16px !important;
    }

    @media (min-width: 600px) {
      .button {
        width: 100%;
      }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  it('beautifies CSS cleanly and preserves structure and comments', () => {
    const beautified = beautifyCss(sampleCss, { indent: '  ' });
    expect(beautified).toContain('/* header comment */');
    expect(beautified).toContain('.button,\n.btn {');
    expect(beautified).toContain('  color: #fff;');
    expect(beautified).toContain('  font-size: 16px !important;');
    expect(beautified).toContain('@media (min-width: 600px) {');
    expect(beautified).toContain('@keyframes spin {');
  });

  it('minifies CSS removing unnecessary whitespace and non-license comments', () => {
    const minified = minifyCss(sampleCss);
    expect(minified).not.toContain('/* header comment */');
    expect(minified).toContain('.button,.btn{color:#fff;background-color:var(--primary-bg, blue);font-size:16px !important;}');
    expect(minified).toContain('@media (min-width: 600px){.button{width:100%;}}');
    expect(minified).toContain('@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}');
  });

  it('preserves license comments in minify when starting with !', () => {
    const withLicense = `
      /*! (c) 2026 MIT License */
      /* normal comment */
      a { color: red; }
    `;
    const min = minifyCss(withLicense, { preserveLicenseComments: true });
    expect(min).toContain('/*! (c) 2026 MIT License */');
    expect(min).not.toContain('normal comment');
  });

  it('throws descriptive CssToolkitError on malformed CSS', () => {
    expect(() => beautifyCss('body { { color: red }')).toThrow(CssToolkitError);
    expect(() => minifyCss('a { unclosed /*')).toThrow(CssToolkitError);
  });
});
