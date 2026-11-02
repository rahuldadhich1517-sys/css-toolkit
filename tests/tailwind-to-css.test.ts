import { describe, it, expect } from 'vitest';
import { tailwindToCss } from '../src/tailwind-to-css/index.js';

describe('tailwind-to-css', () => {
  it('compiles common utility classes using the real Tailwind compiler', async () => {
    const res = await tailwindToCss(['p-4', 'bg-red-500', 'flex', 'text-center']);
    expect(res.classes).toEqual(['p-4', 'bg-red-500', 'flex', 'text-center']);
    expect(res.css).toContain('.p-4');
    expect(res.css).toContain('padding: 1rem');
    expect(res.css).toContain('.bg-red-500');
    expect(res.css).toContain('.flex');
    expect(res.css).toContain('.text-center');
  });

  it('compiles hover, focus, and responsive variants', async () => {
    const res = await tailwindToCss(['hover:text-blue-600', 'sm:flex', 'md:w-1/2']);
    expect(res.css).toContain('.hover\\:text-blue-600:hover');
    expect(res.css).toContain('@media (min-width: 640px)');
    expect(res.css).toContain('@media (min-width: 768px)');
  });

  it('compiles arbitrary values', async () => {
    const res = await tailwindToCss(['w-[123px]', 'bg-[#123456]']);
    expect(res.css).toContain('width: 123px');
    expect(res.css).toContain('#123456');
  });

  it('respects custom theme configuration', async () => {
    const res = await tailwindToCss(['bg-customBrand'], {
      theme: {
        extend: {
          colors: {
            customBrand: '#ff8800',
          },
        },
      },
    });
    expect(res.css).toContain('.bg-customBrand');
    expect(res.css).toContain('255 136 0');
  });

  it('handles empty input gracefully', async () => {
    const res = await tailwindToCss([]);
    expect(res.css).toBe('');
    expect(res.classes).toEqual([]);
  });
});
