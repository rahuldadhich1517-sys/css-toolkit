import { describe, it, expect } from 'vitest';
import { generateContainerQuery } from '../src/css-container-query/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-container-query', () => {
  it('generates named container query with minWidth and maxWidth', () => {
    const res = generateContainerQuery({
      containerName: 'sidebar',
      containerType: 'inline-size',
      minWidth: 400,
      maxWidth: 800,
      declarations: {
        fontSize: '14px',
        display: 'block',
      },
      targetSelector: '.nav-item',
      containerSelector: '.layout-sidebar',
    });

    expect(res.containerCss).toContain('container-type: inline-size;');
    expect(res.containerCss).toContain('container-name: sidebar;');
    expect(res.queryCss).toContain('@container sidebar (min-width: 400px) and (max-width: 800px) {');
    expect(res.queryCss).toContain('.nav-item {');
    expect(res.queryCss).toContain('font-size: 14px;');
  });

  it('generates unnamed container query with height condition', () => {
    const res = generateContainerQuery({
      minHeight: '300px',
      declarations: { opacity: 1 },
    });

    expect(res.queryCss).toContain('@container (min-height: 300px) {');
  });

  it('rejects invalid container name or missing conditions', () => {
    expect(() => generateContainerQuery({})).toThrow(CssToolkitError);
    expect(() =>
      generateContainerQuery({
        containerName: '123-invalid name!',
        minWidth: 300,
      })
    ).toThrow(CssToolkitError);
  });
});
