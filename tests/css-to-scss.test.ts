import { describe, it, expect } from 'vitest';
import { cssToScss } from '../src/css-to-scss/index.js';

describe('css-to-scss', () => {
  it('nests pseudo-classes, modifiers, and child selectors cleanly', () => {
    const flatCss = `
      .button {
        color: blue;
      }
      .button:hover {
        color: red;
      }
      .button.active {
        font-weight: bold;
      }
      .button .icon {
        width: 16px;
      }
    `;

    const scss = cssToScss(flatCss);
    expect(scss).toContain('.button {');
    expect(scss).toContain('&:hover {');
    expect(scss).toContain('&.active {');
    expect(scss).toContain('.icon {');
  });

  it('preserves media queries and at-rules', () => {
    const css = `
      .container {
        width: 100%;
      }
      @media (min-width: 768px) {
        .container {
          width: 750px;
        }
      }
    `;

    const scss = cssToScss(css);
    expect(scss).toContain('@media (min-width: 768px) {');
    expect(scss).toContain('width: 750px;');
  });

  it('preserves comments in SCSS conversion', () => {
    const css = `
      /* main component */
      .card {
        padding: 10px;
      }
    `;
    const scss = cssToScss(css);
    expect(scss).toContain('/* main component */');
    expect(scss).toContain('.card {');
  });
});
