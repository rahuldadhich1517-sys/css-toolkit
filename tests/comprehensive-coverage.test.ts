import { describe, it, expect } from 'vitest';
import {
  cssToTailwind,
  cssToReactNative,
  generateTransform,
  convertCssUnit,
  generateGrid,
  generateFlexbox,
  generateCubicBezier,
  generateMediaQuery,
  generateFilter,
  generateTransition,
  generateTextShadow,
  generateBoxShadow,
  generateClamp,
  generateClipPath,
  generateBorderRadius,
  generateScrollbar,
  beautifyCss,
  compileScss,
  parseColor,
  convertColor,
  calculateSpecificity,
} from '../src/index.js';
import { formatRule } from '../src/internal/css-serializer/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('Comprehensive Branch and Line Coverage', () => {
  it('covers all css-to-tailwind properties and branches', () => {
    const css = `
      .kitchen-sink {
        display: block;
        display: inline-block;
        display: grid;
        display: inline-grid;
        display: inline;
        display: none;
        margin: 16px;
        padding: 24px;
        margin-top: 16px;
        margin-right: 8px;
        margin-bottom: 24px;
        margin-left: 32px;
        padding-top: 4px;
        padding-right: 12px;
        padding-bottom: 20px;
        padding-left: 28px;
        width: 100%;
        width: 100vw;
        height: 100%;
        height: 100vh;
        gap: 16px;
        border-color: #3b82f6;
        color: #ef4444;
        background-color: #10b981;
        text-align: right;
        text-align: justify;
        text-align: left;
        flex-direction: row-reverse;
        flex-direction: column-reverse;
        justify-content: flex-end;
        justify-content: space-around;
        justify-content: space-evenly;
        align-items: flex-end;
        align-items: baseline;
        align-items: stretch;
        border-radius: 0px;
        border-radius: 2px;
        border-radius: 4px;
        border-radius: 6px;
        border-radius: 8px;
        border-radius: 12px;
        border-radius: 16px;
        border-radius: 24px;
        border-radius: 9999px;
        font-weight: 100;
        font-weight: 200;
        font-weight: 400;
        font-weight: 600;
        font-weight: 800;
        font-weight: 900;
        font-size: 12px;
        font-size: 14px;
        font-size: 16px;
        font-size: 18px;
        font-size: 20px;
        font-size: 24px;
        font-size: 30px;
        font-size: 36px;
        font-size: 48px;
      }
    `;

    const res = cssToTailwind(css, { allowArbitraryValues: true });
    expect(res.classes).toContain('m-4');
    expect(res.classes).toContain('p-6');
    expect(res.classes).toContain('w-full');
    expect(res.classes).toContain('w-screen');
    expect(res.classes).toContain('h-full');
    expect(res.classes).toContain('h-screen');
    expect(res.classes).toContain('mt-4');
    expect(res.classes).toContain('mr-2');
    expect(res.classes).toContain('mb-6');
    expect(res.classes).toContain('ml-8');
    expect(res.classes).toContain('pt-1');
    expect(res.classes).toContain('pr-3');
    expect(res.classes).toContain('pb-5');
    expect(res.classes).toContain('pl-7');
    expect(res.classes).toContain('text-right');
    expect(res.classes).toContain('text-justify');
    expect(res.classes).toContain('text-left');
    expect(res.classes).toContain('flex-row-reverse');
    expect(res.classes).toContain('flex-col-reverse');
    expect(res.classes).toContain('justify-end');
    expect(res.classes).toContain('justify-around');
    expect(res.classes).toContain('justify-evenly');
    expect(res.classes).toContain('items-end');
    expect(res.classes).toContain('items-baseline');
    expect(res.classes).toContain('items-stretch');
    expect(res.classes).toContain('font-thin');
    expect(res.classes).toContain('font-extralight');
    expect(res.classes).toContain('font-normal');
    expect(res.classes).toContain('font-semibold');
    expect(res.classes).toContain('font-extrabold');
    expect(res.classes).toContain('font-black');
    expect(res.classes).toContain('text-xs');
    expect(res.classes).toContain('text-sm');
    expect(res.classes).toContain('text-base');
    expect(res.classes).toContain('text-lg');
    expect(res.classes).toContain('text-xl');
    expect(res.classes).toContain('text-2xl');
    expect(res.classes).toContain('text-3xl');
    expect(res.classes).toContain('text-4xl');
    expect(res.classes).toContain('text-5xl');
    expect(res.classes).toContain('rounded-none');
    expect(res.classes).toContain('rounded-sm');
    expect(res.classes).toContain('rounded-md');
    expect(res.classes).toContain('rounded-lg');
    expect(res.classes).toContain('rounded-xl');
    expect(res.classes).toContain('rounded-2xl');
    expect(res.classes).toContain('rounded-3xl');
    expect(res.classes).toContain('rounded-full');
  });

  it('covers all css-to-react-native properties and edge cases', () => {
    const css = `
      .rn-full {
        width: 100px;
        height: 200px;
        min-width: 50px;
        max-width: 150px;
        min-height: 80px;
        max-height: 250px;
        top: 5px;
        right: 10px;
        bottom: 15px;
        left: 20px;
        margin-left: 10px;
        margin-right: 10px;
        margin-bottom: 10px;
        padding-left: 5px;
        padding-right: 5px;
        padding-bottom: 5px;
        gap: 8px;
        row-gap: 4px;
        column-gap: 4px;
        flex-wrap: wrap;
        align-self: flex-start;
        align-content: space-between;
        flex-grow: 2;
        flex-shrink: 1;
        flex-basis: 100px;
        flex: 1;
        position: absolute;
        z-index: 10;
        overflow: hidden;
        font-style: italic;
        line-height: 24px;
        letter-spacing: 1px;
        border-style: dotted;
        border-top-width: 2px;
        border-right-width: 2px;
        border-bottom-width: 2px;
        border-left-width: 2px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    `;

    const res = cssToReactNative(css);
    expect(res.styles.minWidth).toBe(50);
    expect(res.styles.maxWidth).toBe(150);
    expect(res.styles.top).toBe(5);
    expect(res.styles.flexWrap).toBe('wrap');
    expect(res.styles.alignSelf).toBe('flex-start');
    expect(res.styles.alignContent).toBe('space-between');
    expect(res.styles.flexGrow).toBe(2);
    expect(res.styles.flexShrink).toBe(1);
    expect(res.styles.flexBasis).toBe(100);
    expect(res.styles.flex).toBe(1);
    expect(res.styles.position).toBe('absolute');
    expect(res.styles.zIndex).toBe(10);
    expect(res.styles.overflow).toBe('hidden');
    expect(res.styles.fontStyle).toBe('italic');
    expect(res.styles.lineHeight).toBe(24);
    expect(res.styles.letterSpacing).toBe(1);
    expect(res.styles.borderStyle).toBe('dotted');
    expect(res.styles.borderTopWidth).toBe(2);
  });

  it('covers all css-transform operations', () => {
    const res = generateTransform({
      translateY: 20,
      translateZ: 30,
      rotateX: 45,
      rotateZ: 60,
      scaleX: 1.5,
      scaleY: 2,
      skewY: 15,
    });
    expect(res.transform).toContain('translateY(20px)');
    expect(res.transform).toContain('translateZ(30px)');
    expect(res.transform).toContain('rotateX(45deg)');
    expect(res.transform).toContain('rotateZ(60deg)');
    expect(res.transform).toContain('scaleX(1.5)');
    expect(res.transform).toContain('scaleY(2)');
    expect(res.transform).toContain('skewY(15deg)');

    const res3d = generateTransform([
      { type: 'scaleZ', value: 2 },
      { type: 'matrix3d', value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
    ]);
    expect(res3d.transform).toContain('scaleZ(2)');
    expect(res3d.transform).toContain('matrix3d');
  });

  it('covers all unit conversions to and from every unit', () => {
    const ctx = {
      rootFontSize: 16,
      parentFontSize: 20,
      referenceDimension: 500,
      viewportWidth: 1000,
      viewportHeight: 500,
      precision: 2,
    };

    // rem to %
    const remToPercent = convertCssUnit(2, 'rem', '%', ctx);
    expect(remToPercent).toBe(6.4); // 32px / 500 = 6.4%

    // em to vw
    const emToVw = convertCssUnit(1, 'em', 'vw', ctx);
    expect(emToVw).toBe(2); // 20px / 1000 * 100 = 2vw

    // vh to rem
    const vhToRem = convertCssUnit(10, 'vh', 'rem', ctx);
    expect(vhToRem).toBe(3.13); // 50px / 16 = 3.125 -> 3.13

    // px to vmin
    const pxToVmin = convertCssUnit(50, 'px', 'vmin', ctx);
    expect(pxToVmin).toBe(10); // 50 / 500 * 100 = 10%

    // px to vmax
    const pxToVmax = convertCssUnit(100, 'px', 'vmax', ctx);
    expect(pxToVmax).toBe(10); // 100 / 1000 * 100 = 10%

    // vmin to px
    expect(convertCssUnit(10, 'vmin', 'px', ctx)).toBe(50);

    // vmax to px
    expect(convertCssUnit(10, 'vmax', 'px', ctx)).toBe(100);
  });

  it('covers all css-grid options', () => {
    const res = generateGrid({
      columns: '100px 1fr 200px',
      rows: 'auto 1fr',
      autoColumns: 'minmax(100px, auto)',
      autoRows: '50px',
      rowGap: 10,
      columnGap: 20,
      justifyItems: 'center',
      justifyContent: 'space-between',
      alignContent: 'center',
    });

    expect(res.declarations['grid-auto-columns']).toBe('minmax(100px, auto)');
    expect(res.declarations['grid-auto-rows']).toBe('50px');
    expect(res.declarations['row-gap']).toBe('10px');
    expect(res.declarations['column-gap']).toBe('20px');
    expect(res.declarations['justify-items']).toBe('center');
    expect(res.declarations['justify-content']).toBe('space-between');
    expect(res.declarations['align-content']).toBe('center');
  });

  it('covers all css-flexbox options', () => {
    const res = generateFlexbox({
      order: 3,
      flexShrink: 0,
      flexBasis: '250px',
      alignSelf: 'flex-end',
      alignContent: 'center',
      rowGap: 10,
      columnGap: 15,
      wrap: 'wrap-reverse',
    });

    expect(res.declarations['order']).toBe('3');
    expect(res.declarations['flex-shrink']).toBe('0');
    expect(res.declarations['flex-basis']).toBe('250px');
    expect(res.declarations['align-self']).toBe('flex-end');
    expect(res.declarations['align-content']).toBe('center');
    expect(res.declarations['row-gap']).toBe('10px');
    expect(res.declarations['column-gap']).toBe('15px');
    expect(res.declarations['flex-wrap']).toBe('wrap-reverse');
  });

  it('covers cubic-bezier options and defaults', () => {
    const resPoints = generateCubicBezier({
      points: { x1: 0.1, y1: 0.2, x2: 0.8, y2: 0.9 },
    });
    expect(resPoints.points.x1).toBe(0.1);

    const resPreset = generateCubicBezier({ preset: 'ease-in' });
    expect(resPreset.points.x1).toBe(0.42);

    const resDefault = generateCubicBezier({});
    expect(resDefault.points.x1).toBe(0.25);
  });

  it('covers media-query rawCss and height options', () => {
    const res = generateMediaQuery({
      rawCss: '.header { position: sticky; }',
      minHeight: 600,
      maxHeight: 1200,
      orientation: 'portrait',
      mediaType: 'screen',
    });
    expect(res.mediaQuery).toContain('@media screen and (min-height: 600px) and (max-height: 1200px) and (orientation: portrait)');
    expect(res.css).toContain('.header { position: sticky; }');
  });

  it('covers css-serializer formatRule helper', () => {
    const emptyRule = formatRule('.empty', {});
    expect(emptyRule).toBe('.empty {}');

    const formatted = formatRule('.btn', { color: 'red', fontSize: '14px' });
    expect(formatted).toContain('.btn {');
    expect(formatted).toContain('color: red;');
    expect(formatted).toContain('font-size: 14px;');
  });

  it('covers color parser HSL object parsing', () => {
    const fromHslObj = parseColor({ h: 120, s: 100, l: 50 });
    expect(fromHslObj.rgb.g).toBe(255);
    expect(fromHslObj.hex).toBe('#00ff00');
  });

  it('covers specificity :nth-child with of selector', () => {
    const spec = calculateSpecificity(':nth-child(2 of .active)');
    expect(spec.classesAttributesPseudoClasses).toBe(2);
  });

  it('covers remaining branches across filter, transition, clamp, and text-shadow', () => {
    // Scrollbar with border and width > 8
    generateScrollbar({ border: '1px solid black', width: 12, thumbRadius: '4px' });

    // Border radius 3-value shorthand and string radius
    const r3 = generateBorderRadius({
      radius: { topLeft: 10, topRight: 20, bottomRight: 30, bottomLeft: 20 },
    });
    expect(r3.borderRadius).toBe('10px 20px 30px');
    const rStr = generateBorderRadius({ radius: '15px' });
    expect(rStr.borderRadius).toBe('15px');

    // Filter array with dropShadow
    const fRes = generateFilter([
      { type: 'dropShadow', value: { x: 1, y: 2, blur: 3, color: '#ff0000' } },
      { type: 'hueRotate', value: '45deg' },
    ]);
    expect(fRes.filter).toContain('drop-shadow(1px 2px 3px #ff0000)');

    // Transition default
    const tRes = generateTransition({});
    expect(tRes.transition).toContain('all 0.3s ease');

    // Text shadow subtle & layered
    const s1 = generateTextShadow({ preset: 'subtle' });
    expect(s1.textShadow).toContain('1px 1px 2px');
    const s2 = generateTextShadow({ preset: 'layered' });
    expect(s2.textShadow).toContain('1px 1px 1px');

    // Clamp with inverted size
    const clampInv = generateClamp({
      minSize: 32,
      maxSize: 16,
      minViewport: 400,
      maxViewport: 1000,
    });
    expect(clampInv.clamp).toContain('clamp(');
  });
});
