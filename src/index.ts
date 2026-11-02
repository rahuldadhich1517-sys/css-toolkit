// Errors
export { CssToolkitError, type ErrorCode, type SourceLocation } from './internal/errors/index.js';

// 1. color-converter
export {
  convertColor,
  parseColor,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  type RgbColor,
  type HslColor,
  type ColorFormat,
  type ConvertColorOptions,
  type ParsedColor,
} from './color-converter/index.js';

// 2. css-generator
export {
  generateCss,
  type CssRuleInput,
  type GenerateCssOptions,
} from './css-generator/index.js';

// 3. color-to-tailwind
export {
  colorToTailwind,
  type TailwindColorMatch,
  type ColorToTailwindOptions,
  type ColorToTailwindResult,
} from './color-to-tailwind/index.js';

// 4. css-beautify
export {
  beautifyCss,
  type BeautifyCssOptions,
} from './css-beautify/index.js';

// 5. css-border-radius
export {
  generateBorderRadius,
  type CornerRadius,
  type EllipticalRadius,
  type BorderRadiusOptions,
  type BorderRadiusResult,
} from './css-border-radius/index.js';

// 6. css-box-shadow
export {
  generateBoxShadow,
  formatShadowLayer,
  type BoxShadowLayer,
  type BoxShadowResult,
} from './css-box-shadow/index.js';

// 7. css-clamp
export {
  generateClamp,
  type ClampOptions,
  type ClampResult,
} from './css-clamp/index.js';

// 8. css-clip-path
export {
  generateClipPath,
  type ClipPathShape,
  type PointCoord,
  type Point,
  type CircleClipOptions,
  type EllipseClipOptions,
  type InsetClipOptions,
  type PolygonClipOptions,
  type ClipPathOptions,
  type ClipPathResult,
} from './css-clip-path/index.js';

// 9. css-container-query
export {
  generateContainerQuery,
  type ContainerType,
  type ContainerQueryOptions,
  type ContainerQueryResult,
} from './css-container-query/index.js';

// 10. css-cube
export {
  generateCssCube,
  type CubeFaces,
  type CssCubeOptions,
  type CssCubeResult,
} from './css-cube/index.js';

// 11. css-cubic-bezier
export {
  generateCubicBezier,
  validateCubicBezier,
  type CubicBezierPoints,
  type CubicBezierPreset,
  type CubicBezierOptions,
  type CubicBezierResult,
} from './css-cubic-bezier/index.js';

// 12. css-filter
export {
  generateFilter,
  type DropShadowFilter,
  type FilterType,
  type FilterItem,
  type FilterNamedOptions,
  type FilterResult,
} from './css-filter/index.js';

// 13. css-flexbox
export {
  generateFlexbox,
  type FlexDirection,
  type FlexWrap,
  type JustifyContent,
  type AlignItems,
  type AlignContent,
  type AlignSelf,
  type FlexPreset,
  type FlexboxOptions,
  type FlexboxResult,
} from './css-flexbox/index.js';

// 14. css-glassmorphism
export {
  generateGlassmorphism,
  type GlassmorphismBorderOptions,
  type GlassmorphismShadowOptions,
  type GlassmorphismOptions,
  type GlassmorphismResult,
} from './css-glassmorphism/index.js';

// 15. css-gradient
export {
  generateGradient,
  type GradientType,
  type GradientStop,
  type GradientOptions,
  type GradientResult,
} from './css-gradient/index.js';

// 16. css-gradient-text
export {
  generateGradientText,
  type GradientTextOptions,
  type GradientTextResult,
} from './css-gradient-text/index.js';

// 17. css-grid
export {
  generateGrid,
  type GridAutoFlow,
  type GridOptions,
  type GridResult,
} from './css-grid/index.js';

// 18. css-keyframes
export {
  generateKeyframes,
  type KeyframeAnimationOptions,
  type KeyframesOptions,
  type KeyframesResult,
} from './css-keyframes/index.js';

// 19. css-loader
export {
  generateLoader,
  type LoaderType,
  type LoaderOptions,
  type LoaderResult,
} from './css-loader/index.js';

// 20. css-media-query
export {
  generateMediaQuery,
  type BreakpointPreset,
  type MediaQueryOptions,
  type MediaQueryResult,
} from './css-media-query/index.js';

// 21. css-minify
export {
  minifyCss,
  type MinifyCssOptions,
} from './css-minify/index.js';

// 22. css-neumorphism
export {
  generateNeumorphism,
  type NeumorphismStyle,
  type NeumorphismOptions,
  type NeumorphismResult,
} from './css-neumorphism/index.js';

// 23. css-scrollbar
export {
  generateScrollbar,
  type ScrollbarOptions,
  type ScrollbarResult,
} from './css-scrollbar/index.js';

// 24. css-selector-test
export {
  testCssSelector,
  type MatchedElementSummary,
  type SelectorTestResult,
  type SelectorTestOptions,
} from './css-selector-test/index.js';

// 25. css-specificity
export {
  calculateSpecificity,
  compareSpecificity,
  type Specificity,
} from './css-specificity/index.js';

// 26. css-text-shadow
export {
  generateTextShadow,
  type TextShadowLayer,
  type TextShadowPreset,
  type TextShadowOptions,
  type TextShadowResult,
} from './css-text-shadow/index.js';

// 27. css-to-react-native
export {
  cssToReactNative,
  type UnsupportedDeclaration,
  type CssToReactNativeResult,
  type CssToReactNativeOptions,
} from './css-to-react-native/index.js';

// 28. css-to-scss
export {
  cssToScss,
  type CssToScssOptions,
} from './css-to-scss/index.js';

// 29. css-to-tailwind
export {
  cssToTailwind,
  type CssToTailwindOptions,
  type CssToTailwindResult,
} from './css-to-tailwind/index.js';

// 30. css-transform
export {
  generateTransform,
  type TransformType,
  type TransformOperation,
  type TransformNamedOptions,
  type TransformResult,
} from './css-transform/index.js';

// 31. css-transition
export {
  generateTransition,
  type TransitionItem,
  type TransitionOptions,
  type TransitionResult,
} from './css-transition/index.js';

// 32. css-triangle
export {
  generateTriangle,
  type TriangleDirection,
  type TriangleOptions,
  type TriangleResult,
} from './css-triangle/index.js';

// 33. css-unit-convert
export {
  convertCssUnit,
  type SupportedUnit,
  type UnitConversionContext,
} from './css-unit-convert/index.js';

// 34. scss-compile
export {
  compileScss,
  type CompileScssOptions,
  type CompileScssResult,
} from './scss-compile/index.js';

// 35. tailwind-to-css
export {
  tailwindToCss,
  type TailwindToCssOptions,
  type TailwindToCssResult,
} from './tailwind-to-css/index.js';
