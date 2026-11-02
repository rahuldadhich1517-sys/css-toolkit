import { describe, it, expect } from 'vitest';
import { generateFlexbox } from '../src/css-flexbox/index.js';

describe('css-flexbox', () => {
  it('generates default flex layout and common properties', () => {
    const res = generateFlexbox({
      direction: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
    });

    expect(res.declarations['display']).toBe('flex');
    expect(res.declarations['flex-direction']).toBe('column');
    expect(res.declarations['justify-content']).toBe('space-between');
    expect(res.declarations['align-items']).toBe('center');
    expect(res.declarations['gap']).toBe('16px');
  });

  it('supports presets like center and stack', () => {
    const centerRes = generateFlexbox({ preset: 'center' });
    expect(centerRes.declarations['justify-content']).toBe('center');
    expect(centerRes.declarations['align-items']).toBe('center');

    const stackRes = generateFlexbox({ preset: 'stack' });
    expect(stackRes.declarations['flex-direction']).toBe('column');
  });

  it('supports selector wrapping and inline flex', () => {
    const res = generateFlexbox({
      inline: true,
      selector: '.nav-bar',
      gap: '1rem',
      flexGrow: 1,
    });

    expect(res.declarations['display']).toBe('inline-flex');
    expect(res.declarations['flex-grow']).toBe('1');
    expect(res.css).toContain('.nav-bar {');
  });
});
