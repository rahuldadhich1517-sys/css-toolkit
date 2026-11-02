const assert = require('node:assert/strict');

const {
  convertColor,
  parseColor,
  beautifyCss,
  minifyCss,
  generateBorderRadius,
  generateBoxShadow,
  generateClamp,
  generateFlexbox,
  generateGrid,
  generateGradient,
  generateGradientText,
  cssToReactNative,
  cssToScss,
  cssToTailwind,
  testCssSelector,
  calculateSpecificity,
  convertCssUnit,
  CssToolkitError,
} = require('@rahul_dadhich15/css-toolkit');

const { compileScss } = require('@rahul_dadhich15/css-toolkit/scss');
const {
  tailwindToCss,
  colorToTailwind,
  cssToTailwind: cssToTailwindFromSubpath,
} = require('@rahul_dadhich15/css-toolkit/tailwind');
const {
  compileScss: compileScssFromNode,
  tailwindToCss: tailwindToCssFromNode,
} = require('@rahul_dadhich15/css-toolkit/node');

async function runCjsSmokeTest() {
  console.log('--- Running CommonJS Runtime Smoke Test ---');

  // 1. Root package API tests
  console.log('1. Testing root package CommonJS exports...');
  const rgb = convertColor('#3b82f6', { format: 'rgb' });
  assert.equal(rgb, 'rgb(59, 130, 246)', 'convertColor RGB output mismatch');

  const beautified = beautifyCss('.card{color:red;padding:10px;}');
  assert.ok(beautified.includes('{\n  color: red;\n'), 'beautifyCss formatting mismatch');

  const minified = minifyCss('.card { color: red; margin: 0; }');
  assert.equal(minified, '.card{color:red;margin:0;}', 'minifyCss minification mismatch');

  const borderRadius = generateBorderRadius({ radius: 8 });
  assert.equal(borderRadius.borderRadius, '8px', 'generateBorderRadius mismatch');

  const boxShadow = generateBoxShadow({ x: 0, y: 2, blur: 4, color: 'rgba(0, 0, 0, 0.1)' });
  assert.equal(boxShadow.boxShadow, '0 2px 4px 0 rgba(0, 0, 0, 0.1)', 'generateBoxShadow mismatch');

  const clamp = generateClamp({ minSize: 16, maxSize: 24, minViewport: 320, maxViewport: 1200 });
  assert.ok(clamp.clamp.startsWith('clamp('), 'generateClamp mismatch');

  const flex = generateFlexbox({ direction: 'row', justifyContent: 'center' });
  assert.equal(flex.declarations['display'], 'flex');
  assert.equal(flex.declarations['justify-content'], 'center');

  const grid = generateGrid({ columns: 2, gap: 8 });
  assert.equal(grid.declarations['display'], 'grid');
  assert.equal(grid.declarations['grid-template-columns'], 'repeat(2, 1fr)');

  const gradient = generateGradient({ type: 'linear', angle: 90, stops: ['#ff0000', '#0000ff'] });
  assert.equal(gradient.gradient, 'linear-gradient(90deg, #ff0000, #0000ff)');

  const gradientText = generateGradientText({ type: 'linear', angle: 90, stops: ['#ff0000', '#0000ff'] });
  assert.equal(gradientText.declarations['background-clip'], 'text');

  const rn = cssToReactNative('margin-top: 16px; background-color: #ff0000;');
  assert.equal(rn.styles.marginTop, 16);
  assert.equal(rn.styles.backgroundColor, '#ff0000');

  const scssNested = cssToScss('.btn { color: red; } .btn:hover { color: blue; }');
  assert.ok(scssNested.includes('&:hover'), 'cssToScss nesting mismatch');

  const tw = cssToTailwind('.box { display: flex; padding: 16px; }');
  assert.ok(tw.classes.includes('flex'));
  assert.ok(tw.classes.includes('p-4'));

  const selector = testCssSelector('ul > li.active', '<ul><li class="active">Item</li></ul>');
  assert.equal(selector.matches, true);
  assert.equal(selector.count, 1);

  const spec = calculateSpecificity('#nav .item a');
  assert.equal(spec.ids, 1);
  assert.equal(spec.classesAttributesPseudoClasses, 1);
  assert.equal(spec.elementsPseudoElements, 1);

  const unit = convertCssUnit(16, 'px', 'rem', { rootFontSize: 16 });
  assert.equal(unit, 1);

  // Error handling check
  assert.throws(
    () => parseColor('not-a-color'),
    (err) => err instanceof CssToolkitError || err.name === 'CssToolkitError',
    'parseColor should throw CssToolkitError for invalid input'
  );

  // 2. Subpath ./scss
  console.log('2. Testing ./scss subpath...');
  const scssResult = compileScss('$theme: #2563eb; .btn { background-color: $theme; }');
  assert.ok(scssResult.css.includes('#2563eb'), 'compileScss output mismatch');

  // 3. Subpath ./tailwind
  console.log('3. Testing ./tailwind subpath...');
  const twColor = colorToTailwind('#3b82f6');
  assert.equal(twColor.match?.name, 'blue');
  assert.equal(twColor.match?.shade, '500');

  const twSub = cssToTailwindFromSubpath('.box { display: flex; }');
  assert.ok(twSub.classes.includes('flex'));

  const twCompiled = await tailwindToCss(['p-4', 'bg-blue-500']);
  assert.ok(twCompiled.css.includes('padding: 1rem'), 'tailwindToCss missing p-4 style');
  assert.ok(twCompiled.css.includes('.bg-blue-500'), 'tailwindToCss missing bg-blue-500 rule');

  // 4. Subpath ./node
  console.log('4. Testing ./node subpath...');
  const scssNodeResult = compileScssFromNode('$c: #ff0000; a { color: $c; }');
  assert.ok(scssNodeResult.css.includes('color: #ff0000;'));

  const twNodeResult = await tailwindToCssFromNode(['text-center']);
  assert.ok(twNodeResult.css.includes('text-align: center'));

  console.log('✓ CommonJS Runtime Smoke Test: PASSED');
}

runCjsSmokeTest().catch((err) => {
  console.error('CommonJS smoke test failed:', err);
  process.exit(1);
});
