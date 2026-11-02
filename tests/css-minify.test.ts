import { describe, it, expect } from 'vitest';
import { minifyCss } from '../src/index.js';

describe('css-minify', () => {
  it('minifies simple rules and declarations', () => {
    const input = `
      .card {
        padding: 16px;
        margin: 8px;
        color: #333333 !important;
      }
    `;
    const res = minifyCss(input);
    expect(res).toBe('.card{padding:16px;margin:8px;color:#333333 !important;}');
  });

  it('preserves license comments by default and strips regular comments', () => {
    const input = `
      /*! MIT License (c) 2026 */
      /* Normal comment to remove */
      .header {
        display: flex;
      }
    `;
    const res = minifyCss(input);
    expect(res).toContain('/*! MIT License (c) 2026 */');
    expect(res).not.toContain('Normal comment');
    expect(res).toContain('.header{display:flex;}');
  });

  it('strips license comments when preserveLicenseComments is false', () => {
    const input = `
      /*! MIT License */
      a { color: red; }
    `;
    const res = minifyCss(input, { preserveLicenseComments: false });
    expect(res).toBe('a{color:red;}');
  });

  it('minifies at-rules with and without bodies', () => {
    const input = `
      @import url("style.css");
      @media (min-width: 768px) {
        .box {
          width: 50%;
        }
      }
    `;
    const res = minifyCss(input);
    expect(res).toContain('@import url("style.css");');
    expect(res).toContain('@media (min-width: 768px){.box{width:50%;}}');
  });
});
