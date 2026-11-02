import { describe, it, expect } from 'vitest';
import { testCssSelector } from '../src/css-selector-test/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-selector-test', () => {
  const sampleHtml = `
    <!DOCTYPE html>
    <html>
      <body>
        <div id="container" class="wrapper main-content" data-test="alpha">
          <h1>Title</h1>
          <ul class="nav-list">
            <li class="item active"><a href="/home">Home</a></li>
            <li class="item"><a href="/about">About</a></li>
            <li class="item disabled"><a href="/contact">Contact</a></li>
          </ul>
        </div>
      </body>
    </html>
  `;

  it('matches class, id, descendant, child, and attribute selectors', () => {
    const idRes = testCssSelector('#container', sampleHtml);
    expect(idRes.matches).toBe(true);
    expect(idRes.count).toBe(1);
    expect(idRes.elements[0]?.attributes['data-test']).toBe('alpha');

    const classRes = testCssSelector('.item', sampleHtml);
    expect(classRes.count).toBe(3);

    const childRes = testCssSelector('ul.nav-list > li.active', sampleHtml);
    expect(childRes.count).toBe(1);
    expect(childRes.elements[0]?.text).toBe('Home');

    const attrRes = testCssSelector('a[href="/about"]', sampleHtml);
    expect(attrRes.count).toBe(1);
    expect(attrRes.elements[0]?.text).toBe('About');
  });

  it('handles unmatched selectors', () => {
    const res = testCssSelector('.non-existent', sampleHtml);
    expect(res.matches).toBe(false);
    expect(res.count).toBe(0);
    expect(res.elements).toEqual([]);
  });

  it('handles malformed HTML safely without crashing', () => {
    const malformed = '<div><p>Unclosed paragraph';
    const res = testCssSelector('p', malformed);
    expect(res.matches).toBe(true);
    expect(res.count).toBe(1);
  });

  it('does NOT execute scripts inside HTML', () => {
    const withScript = '<div><script>globalThis.__hacked = true;</script><span>Text</span></div>';
    const res = testCssSelector('span', withScript);
    expect(res.matches).toBe(true);
    expect((globalThis as any).__hacked).toBeUndefined();
  });

  it('throws on invalid CSS selector syntax', () => {
    expect(() => testCssSelector(':::invalid-selector', sampleHtml)).toThrow(CssToolkitError);
    expect(() => testCssSelector('', sampleHtml)).toThrow(CssToolkitError);
  });
});
