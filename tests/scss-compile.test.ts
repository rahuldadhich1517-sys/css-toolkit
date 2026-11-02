import { describe, it, expect } from 'vitest';
import { compileScss } from '../src/scss-compile/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('scss-compile', () => {
  it('compiles SCSS variables, nesting, mixins, and functions', () => {
    const scss = `
      $primary: #3b82f6;

      @mixin flex-center {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .card {
        background-color: $primary;
        @include flex-center;

        .title {
          font-size: 16px + 4px;
        }

        &:hover {
          opacity: 0.9;
        }
      }
    `;

    const res = compileScss(scss);
    expect(res.css).toContain('.card {');
    expect(res.css).toContain('background-color: #3b82f6;');
    expect(res.css).toContain('display: flex;');
    expect(res.css).toContain('.card .title {');
    expect(res.css).toContain('font-size: 20px;');
    expect(res.css).toContain('.card:hover {');
  });

  it('supports compressed output style', () => {
    const scss = `$c: red; .a { color: $c; }`;
    const res = compileScss(scss, { style: 'compressed' });
    expect(res.css.trim()).toBe('.a{color:red}');
  });

  it('throws descriptive CssToolkitError with line and column on syntax errors', () => {
    const invalidScss = `.broken { color: ; }`;
    try {
      compileScss(invalidScss);
      expect.fail('Should have thrown an error');
    } catch (err: any) {
      expect(err).toBeInstanceOf(CssToolkitError);
      expect(err.code).toBe('SCSS_COMPILATION_ERROR');
      expect(err.location?.line).toBeDefined();
    }
  });
});
