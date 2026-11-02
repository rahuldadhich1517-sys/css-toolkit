import { describe, it, expect } from 'vitest';
import {
  convertColor,
  colorToTailwind,
  generateGradient,
  generateGradientText,
  generateBoxShadow,
  generateNeumorphism,
  generateKeyframes,
  generateLoader,
  generateCubicBezier,
  generateTransition,
  generateCss,
  beautifyCss,
  minifyCss,
  cssToScss,
  compileScss,
  calculateSpecificity,
  testCssSelector,
  convertCssUnit,
  generateClamp,
  cssToTailwind,
  tailwindToCss,
} from '../src/index.js';

describe('Cross-Utility Integration Tests', () => {
  it('1. color-converter -> color-to-tailwind', () => {
    const converted = convertColor({ r: 239, g: 68, b: 68 }, { format: 'hex' });
    const tw = colorToTailwind(converted, { prefix: 'bg-' });
    expect(tw.match?.className).toBe('bg-red-500');
    expect(tw.match?.exact).toBe(true);
  });

  it('2. css-gradient -> css-gradient-text', () => {
    const grad = generateGradient({
      angle: 90,
      stops: ['#ff0000', '#0000ff'],
    });
    const textGrad = generateGradientText({
      angle: 90,
      stops: ['#ff0000', '#0000ff'],
    });
    expect(textGrad.gradient).toBe(grad.gradient);
  });

  it('3. css-box-shadow -> css-neumorphism', () => {
    const neu = generateNeumorphism({ background: '#e0e0e0', distance: 10, blur: 20 });
    const shadow = generateBoxShadow([
      { x: -10, y: -10, blur: 20, color: '#ffffff' },
      { x: 10, y: 10, blur: 20, color: '#b9b9b9' },
    ]);
    expect(neu.boxShadow).toContain('-10px -10px 20px 0');
    expect(neu.boxShadow).toContain('10px 10px 20px 0');
    expect(shadow.boxShadow).toContain('10px 10px 20px 0');
  });

  it('4. css-keyframes -> css-loader', () => {
    const loader = generateLoader({ type: 'spinner', className: 'spin-it' });
    expect(loader.css).toContain('@keyframes spin-it-spin');
    expect(loader.html).toContain('class="spin-it"');
  });

  it('5. css-cubic-bezier -> css-transition', () => {
    const bezier = generateCubicBezier('ease-in-out');
    const transition = generateTransition({
      property: 'opacity',
      duration: '0.3s',
      timingFunction: bezier.cubicBezier,
    });
    expect(transition.transition).toBe(`opacity 0.3s ${bezier.cubicBezier}`);
  });

  it('6. css-generator -> css-beautify -> css-minify', () => {
    const rawCss = generateCss({
      selector: '.box',
      declarations: { margin: '10px', color: '#fff' },
    });
    const beautified = beautifyCss(rawCss);
    expect(beautified).toContain('  margin: 10px;');
    const minified = minifyCss(beautified);
    expect(minified).toBe('.box{margin:10px;color:#fff;}');
  });

  it('7. css-to-scss -> scss-compile -> compare CSS semantics', () => {
    const flat = `
      .card { color: blue; }
      .card:hover { color: red; }
    `;
    const scss = cssToScss(flat);
    expect(scss).toContain('.card {');
    expect(scss).toContain('&:hover {');

    const compiled = compileScss(scss);
    expect(compiled.css).toContain('.card {');
    expect(compiled.css).toContain('.card:hover {');
    expect(compiled.css).toContain('color: red;');
  });

  it('8. css-specificity -> selector-list testing', () => {
    const html = '<div class="btn primary" id="cta">Click</div>';
    const spec1 = calculateSpecificity('.btn.primary');
    const spec2 = calculateSpecificity('#cta');
    expect(spec2.ids).toBe(1);
    expect(spec1.classesAttributesPseudoClasses).toBe(2);

    const match1 = testCssSelector('.btn.primary', html);
    const match2 = testCssSelector('#cta', html);
    expect(match1.matches).toBe(true);
    expect(match2.matches).toBe(true);
  });

  it('9. css-unit-convert -> css-clamp', () => {
    const minRem = convertCssUnit(16, 'px', 'rem', { rootFontSize: 16 });
    const maxRem = convertCssUnit(32, 'px', 'rem', { rootFontSize: 16 });
    expect(minRem).toBe(1);
    expect(maxRem).toBe(2);

    const clamp = generateClamp({
      minSize: 16,
      maxSize: 32,
      minViewport: 320,
      maxViewport: 1120,
      rootFontSize: 16,
      unit: 'rem',
    });
    expect(clamp.min).toBe(`${minRem}rem`);
    expect(clamp.max).toBe(`${maxRem}rem`);
  });

  it('10. css-to-tailwind -> tailwind-to-css round trip', async () => {
    const cssInput = '.btn { padding: 16px; display: flex; }';
    const tw = cssToTailwind(cssInput);
    expect(tw.classes).toContain('p-4');
    expect(tw.classes).toContain('flex');

    const compiled = await tailwindToCss(tw.classes);
    expect(compiled.css).toContain('.p-4');
    expect(compiled.css).toContain('padding: 1rem');
    expect(compiled.css).toContain('.flex');
  });
});
