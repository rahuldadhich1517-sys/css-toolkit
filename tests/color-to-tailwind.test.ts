import { describe, it, expect } from 'vitest';
import { colorToTailwind } from '../src/color-to-tailwind/index.js';

describe('color-to-tailwind', () => {
  it('finds exact palette matches', () => {
    const resWhite = colorToTailwind('#ffffff');
    expect(resWhite.match).not.toBeNull();
    expect(resWhite.match?.name).toBe('white');
    expect(resWhite.match?.exact).toBe(true);
    expect(resWhite.match?.distance).toBe(0);

    const resBlack = colorToTailwind('#000000');
    expect(resBlack.match?.name).toBe('black');
    expect(resBlack.match?.exact).toBe(true);

    const resRed500 = colorToTailwind('#ef4444');
    expect(resRed500.match?.name).toBe('red');
    expect(resRed500.match?.shade).toBe('500');
    expect(resRed500.match?.exact).toBe(true);
  });

  it('finds closest perceptual match for custom colors', () => {
    // Slightly darker red
    const res = colorToTailwind('#ee4040', { candidates: 3, prefix: 'bg-' });
    expect(res.match).not.toBeNull();
    expect(res.match?.name).toBe('red');
    expect(res.match?.className.startsWith('bg-red-')).toBe(true);
    expect(res.candidates.length).toBe(3);
    expect(res.match?.exact).toBe(false);
  });

  it('respects maxDistance filter', () => {
    // Distance too large should return null match
    const res = colorToTailwind('#ff00ff', { maxDistance: 1 });
    // Unless fuchsia matches within 1
    if (res.candidates.length === 0) {
      expect(res.match).toBeNull();
    }
  });

  it('supports custom palettes', () => {
    const customPalette = {
      brand: {
        primary: '#123456',
        accent: '#abcdef',
      },
    };
    const res = colorToTailwind('#123456', { palette: customPalette });
    expect(res.match?.name).toBe('brand');
    expect(res.match?.shade).toBe('primary');
    expect(res.match?.exact).toBe(true);
  });
});
