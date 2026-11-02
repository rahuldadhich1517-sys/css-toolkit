import { describe, it, expect } from 'vitest';
import {
  generateCss,
  generateCssCube,
  testCssSelector,
  beautifyCss,
  compileScss,
  tailwindToCss,
} from '../src/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('Security and Input Safety', () => {
  it('blocks HTML/script-like tags and javascript: URLs in CSS inputs', () => {
    expect(() =>
      generateCss({
        selector: '.danger',
        declarations: { content: '<script>alert(1)</script>' },
      })
    ).toThrow(CssToolkitError);

    expect(() =>
      generateCss({
        selector: '.danger',
        declarations: { backgroundImage: 'url("javascript:alert(1)")' },
      })
    ).toThrow(CssToolkitError);
  });

  it('escapes arbitrary HTML inside 3D Cube face contents', () => {
    const cube = generateCssCube({
      faceContent: {
        front: '"><script>alert(1)</script><div class="',
      },
    });

    expect(cube.html).not.toContain('<script>');
    expect(cube.html).toContain('&lt;script&gt;');
  });

  it('safely evaluates untrusted HTML in selector testing without executing scripts', () => {
    const untrustedHtml = `
      <div id="safe">
        <script>
          window.__injected = true;
        </script>
        <span class="safe-text">Protected</span>
      </div>
    `;

    const res = testCssSelector('.safe-text', untrustedHtml);
    expect(res.matches).toBe(true);
    expect(res.elements[0]?.text).toBe('Protected');
    expect((globalThis as any).__injected).toBeUndefined();
  });

  it('rejects unsafe content in SCSS input and Tailwind input', async () => {
    expect(() => compileScss('$var: "<script>"; .a { content: $var; }')).toThrow(CssToolkitError);

    await expect(
      tailwindToCss(['p-4', '<script>alert(1)</script>'])
    ).rejects.toThrow(CssToolkitError);
  });
});
