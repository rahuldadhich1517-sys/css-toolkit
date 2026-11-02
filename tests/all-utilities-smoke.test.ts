import { describe, it, expect } from 'vitest';
import {
  // 1. color-converter
  convertColor,
  // 2. css-generator
  generateCss,
  // 3. color-to-tailwind
  colorToTailwind,
  // 4. css-beautify
  beautifyCss,
  // 5. css-border-radius
  generateBorderRadius,
  // 6. css-box-shadow
  generateBoxShadow,
  // 7. css-clamp
  generateClamp,
  // 8. css-clip-path
  generateClipPath,
  // 9. css-container-query
  generateContainerQuery,
  // 10. css-cube
  generateCssCube,
  // 11. css-cubic-bezier
  generateCubicBezier,
  // 12. css-filter
  generateFilter,
  // 13. css-flexbox
  generateFlexbox,
  // 14. css-glassmorphism
  generateGlassmorphism,
  // 15. css-gradient
  generateGradient,
  // 16. css-gradient-text
  generateGradientText,
  // 17. css-grid
  generateGrid,
  // 18. css-keyframes
  generateKeyframes,
  // 19. css-loader
  generateLoader,
  // 20. css-media-query
  generateMediaQuery,
  // 21. css-minify
  minifyCss,
  // 22. css-neumorphism
  generateNeumorphism,
  // 23. css-scrollbar
  generateScrollbar,
  // 24. css-selector-test
  testCssSelector,
  // 25. css-specificity
  calculateSpecificity,
  // 26. css-text-shadow
  generateTextShadow,
  // 27. css-to-react-native
  cssToReactNative,
  // 28. css-to-scss
  cssToScss,
  // 29. css-to-tailwind
  cssToTailwind,
  // 30. css-transform
  generateTransform,
  // 31. css-transition
  generateTransition,
  // 32. css-triangle
  generateTriangle,
  // 33. css-unit-convert
  convertCssUnit,
  // 34. scss-compile
  compileScss,
  // 35. tailwind-to-css
  tailwindToCss,
} from '../src/index.js';

describe('All 35 Utility Tools Smoke Verification', () => {
  it('1. color-converter converts formats correctly', () => {
    const res = convertColor('#3b82f6', { format: 'rgb' });
    expect(res).toBe('rgb(59, 130, 246)');
  });

  it('2. css-generator produces CSS rules', () => {
    const res = generateCss({ selector: '.box', declarations: { margin: '10px' } });
    expect(res).toContain('.box');
    expect(res).toContain('margin: 10px;');
  });

  it('3. color-to-tailwind matches closest Tailwind color', () => {
    const res = colorToTailwind('#3b82f6');
    expect(res.match?.name).toBe('blue');
    expect(res.match?.shade).toBe('500');
  });

  it('4. css-beautify formats CSS properly', () => {
    const res = beautifyCss('.box{color:red;}');
    expect(res).toContain('{\n  color: red;\n}');
  });

  it('5. css-border-radius generates border-radius styles', () => {
    const res = generateBorderRadius({ radius: 8 });
    expect(res.borderRadius).toBe('8px');
  });

  it('6. css-box-shadow generates shadow layers', () => {
    const res = generateBoxShadow({ x: 0, y: 2, blur: 4, color: 'rgba(0, 0, 0, 0.1)' });
    expect(res.boxShadow).toBe('0 2px 4px 0 rgba(0, 0, 0, 0.1)');
  });

  it('7. css-clamp generates responsive fluid clamps', () => {
    const res = generateClamp({ minSize: 16, maxSize: 24, minViewport: 320, maxViewport: 1200 });
    expect(res.clamp).toContain('clamp(');
  });

  it('8. css-clip-path generates polygon and shape paths', () => {
    const res = generateClipPath({
      shape: 'polygon',
      points: [
        [50, 0],
        [0, 100],
        [100, 100],
      ],
    });
    expect(res.clipPath).toBe('polygon(50% 0%, 0% 100%, 100% 100%)');
  });

  it('9. css-container-query generates container queries', () => {
    const res = generateContainerQuery({
      containerName: 'sidebar',
      minWidth: 400,
      declarations: { fontSize: '14px' },
    });
    expect(res.queryCss).toContain('@container sidebar');
  });

  it('10. css-cube generates 3D cube CSS', () => {
    const res = generateCssCube({ size: 100 });
    expect(res.css).toContain('.cube');
  });

  it('11. css-cubic-bezier generates transition timing functions', () => {
    const res = generateCubicBezier('ease-in-out');
    expect(res.cubicBezier).toBe('cubic-bezier(0.42, 0, 0.58, 1)');
  });

  it('12. css-filter generates filter definitions', () => {
    const res = generateFilter({ blur: 5, brightness: 1.2 });
    expect(res.filter).toContain('blur(5px)');
    expect(res.filter).toContain('brightness(1.2)');
  });

  it('13. css-flexbox generates flex layout declarations', () => {
    const res = generateFlexbox({ direction: 'row', justifyContent: 'center', alignItems: 'center' });
    expect(res.declarations['display']).toBe('flex');
    expect(res.declarations['justify-content']).toBe('center');
  });

  it('14. css-glassmorphism generates frosted glass effects', () => {
    const res = generateGlassmorphism({ blur: 10, opacity: 0.2 });
    expect(res.declarations['backdrop-filter']).toBe('blur(10px)');
  });

  it('15. css-gradient generates linear and radial gradients', () => {
    const res = generateGradient({
      type: 'linear',
      angle: 90,
      stops: ['#ff0000', '#0000ff'],
    });
    expect(res.gradient).toBe('linear-gradient(90deg, #ff0000, #0000ff)');
  });

  it('16. css-gradient-text generates gradient clipped text', () => {
    const res = generateGradientText({
      type: 'linear',
      angle: 90,
      stops: ['#ff0000', '#0000ff'],
    });
    expect(res.declarations['background-clip']).toBe('text');
  });

  it('17. css-grid generates CSS grid layouts', () => {
    const res = generateGrid({ columns: 3, gap: 16 });
    expect(res.declarations['display']).toBe('grid');
    expect(res.declarations['grid-template-columns']).toBe('repeat(3, 1fr)');
  });

  it('18. css-keyframes generates animation keyframes', () => {
    const res = generateKeyframes({
      name: 'pulse',
      keyframes: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
    });
    expect(res.keyframesCss).toContain('@keyframes pulse');
  });

  it('19. css-loader generates CSS spinners and loaders', () => {
    const res = generateLoader({ type: 'spinner', size: 30, color: '#3b82f6' });
    expect(res.css).toContain('.loader-spinner');
  });

  it('20. css-media-query generates media queries', () => {
    const res = generateMediaQuery({ minWidth: 768 });
    expect(res.mediaQuery).toBe('@media (min-width: 768px)');
  });

  it('21. css-minify minifies CSS declarations', () => {
    const res = minifyCss('.card { color: red; margin: 0; }');
    expect(res).toBe('.card{color:red;margin:0;}');
  });

  it('22. css-neumorphism generates soft UI neumorphic shadows', () => {
    const res = generateNeumorphism({ shape: 'flat', color: '#e0e0e0', distance: 10 });
    expect(res.declarations['box-shadow']).toBeDefined();
  });

  it('23. css-scrollbar generates custom scrollbar rules', () => {
    const res = generateScrollbar({ width: 8, thumbColor: '#888' });
    expect(res.css).toContain('::-webkit-scrollbar');
  });

  it('24. css-selector-test matches selectors against HTML', () => {
    const res = testCssSelector('ul > li.active', '<ul><li class="active">Item</li></ul>');
    expect(res.matches).toBe(true);
    expect(res.count).toBe(1);
  });

  it('25. css-specificity calculates specificity tuple', () => {
    const res = calculateSpecificity('nav > ul.menu li#active');
    expect(res).toEqual({
      inline: 0,
      ids: 1,
      classesAttributesPseudoClasses: 1,
      elementsPseudoElements: 3,
    });
  });

  it('26. css-text-shadow generates text shadows', () => {
    const res = generateTextShadow({ layers: [{ x: 1, y: 1, blur: 2, color: '#000000' }] });
    expect(res.textShadow).toBe('1px 1px 2px #000000');
  });

  it('27. css-to-react-native converts CSS to React Native StyleSheet', () => {
    const res = cssToReactNative('margin-top: 16px; background-color: #ff0000;');
    expect(res.styles.marginTop).toBe(16);
    expect(res.styles.backgroundColor).toBe('#ff0000');
  });

  it('28. css-to-scss converts flat CSS into nested SCSS', () => {
    const res = cssToScss('.btn { color: red; } .btn:hover { color: blue; }');
    expect(res).toContain('&:hover');
  });

  it('29. css-to-tailwind maps CSS declarations to Tailwind classes', () => {
    const res = cssToTailwind('.box { display: flex; padding: 16px; }');
    expect(res.classes).toContain('flex');
    expect(res.classes).toContain('p-4');
  });

  it('30. css-transform generates 2D and 3D transform strings', () => {
    const res = generateTransform({ scale: 1.5, rotate: '45deg' });
    expect(res.transform).toContain('scale(1.5)');
    expect(res.transform).toContain('rotate(45deg)');
  });

  it('31. css-transition generates transition shorthand properties', () => {
    const res = generateTransition({ property: 'opacity', duration: 0.2, timingFunction: 'ease' });
    expect(res.transition).toBe('opacity 0.2s ease');
  });

  it('32. css-triangle generates pure CSS triangle borders', () => {
    const res = generateTriangle({ direction: 'up', width: 20, height: 10, color: '#ff0000' });
    expect(res.declarations['border-style']).toBe('solid');
    expect(res.declarations['border-color']).toContain('#ff0000');
  });

  it('33. css-unit-convert converts CSS units accurately', () => {
    const res = convertCssUnit(16, 'px', 'rem', { rootFontSize: 16 });
    expect(res).toBe(1);
  });

  it('34. scss-compile compiles SCSS using Sass compiler', () => {
    const res = compileScss('$c: blue; .box { color: $c; }');
    expect(res.css).toContain('color: blue;');
  });

  it('35. tailwind-to-css compiles Tailwind classes using Tailwind compiler', async () => {
    const res = await tailwindToCss(['p-4', 'bg-blue-500']);
    expect(res.css).toContain('padding: 1rem');
    expect(res.css).toContain('.bg-blue-500');
  });
});
