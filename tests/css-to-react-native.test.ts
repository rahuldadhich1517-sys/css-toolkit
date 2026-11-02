import { describe, it, expect } from 'vitest';
import { cssToReactNative } from '../src/css-to-react-native/index.js';

describe('css-to-react-native', () => {
  it('converts layout, typography, dimensions, colors, and borders', () => {
    const css = `
      .card {
        width: 320px;
        height: 100%;
        margin-top: 16px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #ffffff;
        color: #111827;
        font-size: 16px;
        font-weight: 700;
        border-radius: 8px;
        border-width: 1px;
        border-color: #e5e7eb;
        opacity: 0.95;
      }
    `;

    const res = cssToReactNative(css);
    expect(res.styles.width).toBe(320);
    expect(res.styles.height).toBe('100%');
    expect(res.styles.marginTop).toBe(16);
    expect(res.styles.padding).toBe(24);
    expect(res.styles.display).toBe('flex');
    expect(res.styles.flexDirection).toBe('column');
    expect(res.styles.justifyContent).toBe('center');
    expect(res.styles.alignItems).toBe('center');
    expect(res.styles.backgroundColor).toBe('#ffffff');
    expect(res.styles.color).toBe('#111827');
    expect(res.styles.fontSize).toBe(16);
    expect(res.styles.fontWeight).toBe('700');
    expect(res.styles.borderRadius).toBe(8);
    expect(res.styles.borderWidth).toBe(1);
    expect(res.styles.borderColor).toBe('#e5e7eb');
    expect(res.styles.opacity).toBe(0.95);
  });

  it('converts rem units based on rootFontSize', () => {
    const css = `
      .box {
        font-size: 1.5rem;
        padding-top: 2rem;
      }
    `;
    const res = cssToReactNative(css, { rootFontSize: 16 });
    expect(res.styles.fontSize).toBe(24);
    expect(res.styles.paddingTop).toBe(32);
  });

  it('reports unsupported declarations rather than silently dropping them', () => {
    const css = `
      .unsupported {
        float: left;
        cursor: pointer;
        clip-path: circle(50%);
      }
    `;
    const res = cssToReactNative(css);
    expect(res.unsupported.length).toBe(3);
    expect(res.unsupported.some((u) => u.property === 'float')).toBe(true);
    expect(res.unsupported.some((u) => u.property === 'cursor')).toBe(true);
    expect(res.unsupported.some((u) => u.property === 'clip-path')).toBe(true);
  });
});
