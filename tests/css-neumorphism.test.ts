import { describe, it, expect } from 'vitest';
import { generateNeumorphism } from '../src/css-neumorphism/index.js';

describe('css-neumorphism', () => {
  it('generates raised neumorphism styles', () => {
    const res = generateNeumorphism({
      background: '#e0e0e0',
      distance: 6,
      blur: 12,
      borderRadius: 16,
      style: 'raised',
      selector: '.neu-card',
    });

    expect(res.declarations['background']).toBe('#e0e0e0');
    expect(res.declarations['border-radius']).toBe('16px');
    expect(res.boxShadow).not.toContain('inset');
    expect(res.boxShadow).toContain('-6px -6px 12px');
    expect(res.boxShadow).toContain('6px 6px 12px');
    expect(res.css).toContain('.neu-card {');
  });

  it('generates pressed / inset neumorphism styles', () => {
    const res = generateNeumorphism({
      background: '#ffffff',
      distance: 4,
      blur: 8,
      style: 'pressed',
      lightColor: '#ffffff',
      darkColor: '#d1d1d1',
    });

    expect(res.boxShadow).toContain('inset -4px -4px 8px 0 #ffffff');
    expect(res.boxShadow).toContain('inset 4px 4px 8px 0 #d1d1d1');
  });
});
