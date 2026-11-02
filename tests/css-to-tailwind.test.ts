import { describe, it, expect } from 'vitest';
import { cssToTailwind } from '../src/css-to-tailwind/index.js';

describe('css-to-tailwind', () => {
  it('maps spacing, display, flexbox, typography, colors, and borders', () => {
    const css = `
      .card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        margin-top: 24px;
        font-size: 14px;
        font-weight: 700;
        text-align: center;
        border-radius: 8px;
        color: #ffffff;
        background-color: #000000;
      }
    `;

    const res = cssToTailwind(css);
    expect(res.classes).toContain('flex');
    expect(res.classes).toContain('flex-col');
    expect(res.classes).toContain('items-center');
    expect(res.classes).toContain('justify-between');
    expect(res.classes).toContain('p-4');
    expect(res.classes).toContain('mt-6');
    expect(res.classes).toContain('text-sm');
    expect(res.classes).toContain('font-bold');
    expect(res.classes).toContain('text-center');
    expect(res.classes).toContain('rounded-lg');
    expect(res.classes).toContain('text-white');
    expect(res.classes).toContain('bg-black');
  });

  it('supports arbitrary values for custom metrics when allowArbitraryValues is true', () => {
    const css = `
      .custom {
        width: 17px;
        padding: 13px;
        font-size: 19px;
      }
    `;

    const res = cssToTailwind(css, { allowArbitraryValues: true });
    expect(res.classes).toContain('w-[17px]');
    expect(res.classes).toContain('p-[13px]');
    expect(res.classes).toContain('text-[19px]');
  });

  it('reports unsupported declarations rather than silently dropping them', () => {
    const css = `
      .box {
        backdrop-filter: blur(10px);
        user-select: none;
      }
    `;
    const res = cssToTailwind(css);
    expect(res.unsupported.length).toBe(2);
    expect(res.unsupported.some((u) => u.property === 'backdrop-filter')).toBe(true);
    expect(res.unsupported.some((u) => u.property === 'user-select')).toBe(true);
  });
});
