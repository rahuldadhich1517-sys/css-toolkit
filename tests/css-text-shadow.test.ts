import { describe, it, expect } from 'vitest';
import { generateTextShadow } from '../src/css-text-shadow/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-text-shadow', () => {
  it('generates single and multiple text shadow layers', () => {
    const res = generateTextShadow({
      layers: [
        { x: 1, y: 1, blur: 2, color: '#000000' },
        { x: 0, y: 0, blur: 5, color: '#ff0000' },
      ],
      selector: '.text-glow',
    });

    expect(res.textShadow).toBe('1px 1px 2px #000000, 0 0 5px #ff0000');
    expect(res.css).toContain('.text-glow {');
    expect(res.css).toContain('text-shadow: 1px 1px 2px #000000, 0 0 5px #ff0000;');
  });

  it('supports presets: glow, outline, subtle, layered', () => {
    const glowRes = generateTextShadow({ preset: 'glow', color: '#3b82f6' });
    expect(glowRes.layers.length).toBe(3);
    expect(glowRes.textShadow).toContain('#3b82f6');

    const outlineRes = generateTextShadow({ preset: 'outline', color: '#000000' });
    expect(outlineRes.layers.length).toBe(4);
  });

  it('returns none when empty', () => {
    const emptyRes = generateTextShadow({});
    expect(emptyRes.textShadow).toBe('none');
  });

  it('rejects invalid colors', () => {
    expect(() => generateTextShadow({ layers: [{ color: 'not-a-color' }] })).toThrow(CssToolkitError);
  });
});
