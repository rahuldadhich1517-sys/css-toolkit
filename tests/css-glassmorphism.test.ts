import { describe, it, expect } from 'vitest';
import { generateGlassmorphism } from '../src/css-glassmorphism/index.js';

describe('css-glassmorphism', () => {
  it('generates glassmorphism styles with backdrop-filter and prefixes', () => {
    const res = generateGlassmorphism({
      backgroundColor: '#ffffff',
      backgroundOpacity: 0.25,
      backdropBlur: 16,
      saturation: 180,
      border: true,
      shadow: true,
      borderRadius: 12,
      selector: '.glass-card',
    });

    expect(res.declarations['background']).toBe('rgba(255, 255, 255, 0.25)');
    expect(res.declarations['-webkit-backdrop-filter']).toBe('blur(16px) saturate(180%)');
    expect(res.declarations['backdrop-filter']).toBe('blur(16px) saturate(180%)');
    expect(res.declarations['border-radius']).toBe('12px');
    expect(res.declarations['border']).toContain('1px solid rgba(255, 255, 255, 0.3)');
    expect(res.declarations['box-shadow']).toContain('rgba(0, 0, 0, 0.1)');
    expect(res.css).toContain('.glass-card {');
  });

  it('allows disabling border or shadow', () => {
    const res = generateGlassmorphism({
      border: false,
      shadow: false,
    });
    expect(res.declarations['border']).toBeUndefined();
    expect(res.declarations['box-shadow']).toBeUndefined();
  });
});
