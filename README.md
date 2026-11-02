# @rahul_dadhich15/css-toolkit

> Production-ready, modular, framework-independent TypeScript toolkit providing 35 reusable CSS generators, color utilities, formatters, layout generators, selector analysis, conversions, SCSS compilation, and real Tailwind integration.

[![CI](https://github.com/rahuldadhich1517-sys/css-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/rahuldadhich1517-sys/css-toolkit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js: >=18](https://img.shields.io/badge/Node.js-%3E%3D18-brightgreen.svg)](https://nodejs.org)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Architecture & Subpath Exports](#architecture--subpath-exports)
- [Utility Inventory (All 35 Utilities)](#utility-inventory-all-35-utilities)
  - [1. Color & CSS Foundations](#1-color--css-foundations)
  - [2. CSS Formatting & Shape Generators](#2-css-formatting--shape-generators)
  - [3. Layout Generators](#3-layout-generators)
  - [4. Animation & Loading Generators](#4-animation--loading-generators)
  - [5. Styling & Optimization](#5-styling--optimization)
  - [6. CSS Conversion & Transformation](#6-css-conversion--transformation)
  - [7. Additional Generators & Compilers](#7-additional-generators--compilers)
- [API Reference & Examples](#api-reference--examples)
- [TypeScript Interfaces & Typing](#typescript-interfaces--typing)
- [CSS Parser & Serializer Behavior](#css-parser--serializer-behavior)
- [Color Conversion & Perceptual Distance](#color-conversion--perceptual-distance)
- [Tailwind Integration & Versioning](#tailwind-integration--versioning)
- [SCSS Compiler Setup & Isolation](#scss-compiler-setup--isolation)
- [Browser vs Node Compatibility](#browser-vs-node-compatibility)
- [Limitations & Non-Supported CSS](#limitations--non-supported-css)
  - [CSS to React Native](#css-to-react-native-limitations)
  - [CSS to SCSS](#css-to-scss-limitations)
  - [CSS to Tailwind](#css-to-tailwind-limitations)
- [Security & Input Safety](#security--input-safety)
- [Dependencies & Licenses](#dependencies--licenses)
- [Performance & Benchmarks](#performance--benchmarks)
- [Development, Testing & Coverage](#development-testing--coverage)
- [Contributing](#contributing)
- [License](#license)
- [Changelog](#changelog)

---

## Overview

`@rahul_dadhich15/css-toolkit` is an all-in-one, highly optimized, strictly typed TypeScript library built for modern CSS workflows. It unifies style generation, formatting, color manipulation, specificity computation, selector testing, cross-platform conversions (React Native, SCSS, Tailwind), and in-memory compilation (Dart Sass and real Tailwind compiler) under a consistent, reliable API.

---

## Key Features

- **Strictly Typed**: Written in TypeScript with 100% function typing, discriminated unions, and explicit return types.
- **Universal & Modular**: Tree-shakeable ESM and CJS bundles with zero browser globals (`window`/`document`) required during module initialization.
- **Perceptual Color Science**: CIELAB (D65) color space calculations and Delta E distance metrics for accurate color conversion and Tailwind matching.
- **Real Parsers & Compilers**: Uses PostCSS for AST manipulation, Dart Sass for SCSS, PostCSS Selector Parser for specificity, and the official Tailwind engine for compilation.
- **Safe & Sandboxed**: Defends against script injection, CSS expression attacks, and prototype pollution. HTML selector tester is static and never executes code or triggers network requests.
- **High Test Coverage**: 160+ unit and integration tests covering all 35 modules, with statement, branch, and line coverage > 90%.

---

## Installation

```bash
npm install @rahul_dadhich15/css-toolkit
```

Or using Yarn / pnpm:

```bash
yarn add @rahul_dadhich15/css-toolkit
pnpm add @rahul_dadhich15/css-toolkit
```

Requirements:
- Node.js >= 18.0.0
- Modern browsers (ES2022+)

---

## Quick Start

```typescript
import {
  convertColor,
  generateCss,
  generateClamp,
  calculateSpecificity,
  compileScss,
  tailwindToCss,
} from '@rahul_dadhich15/css-toolkit';

// 1. Color Conversion
const hex = convertColor('rgb(255, 0, 128)', { format: 'hex' });
// => '#ff0080'

// 2. Fluid Typography & Clamp
const { clamp } = generateClamp({
  minSize: 16,
  maxSize: 32,
  minViewport: 320,
  maxViewport: 1200,
});
// => clamp(1rem, calc(0.7273rem + 1.8182vw), 2rem)

// 3. CSS Specificity
const spec = calculateSpecificity('ul.nav > li#active.item a:hover');
// => { inline: 0, ids: 1, classesAttributesPseudoClasses: 3, elementsPseudoElements: 3 }

// 4. In-Memory SCSS Compilation (Dart Sass)
const scssResult = compileScss('$theme: #3b82f6; .btn { color: $theme; }');
console.log(scssResult.css);

// 5. Official Tailwind Compilation
const twResult = await tailwindToCss(['p-4', 'bg-red-500', 'hover:text-blue-600']);
console.log(twResult.css);
```

---

## Architecture & Subpath Exports

The library exposes both a root package entry point and dedicated subpath exports to prevent unnecessary Node dependencies from leaking into browser bundles:

```text
@rahul_dadhich15/css-toolkit           -> Root universal entry point (all 35 utilities)
@rahul_dadhich15/css-toolkit/scss      -> Dedicated SCSS compiler utilities
@rahul_dadhich15/css-toolkit/tailwind  -> Dedicated Tailwind compiler & converter utilities
@rahul_dadhich15/css-toolkit/node      -> Node-optimized utilities (compileScss, tailwindToCss)
```

---

## Utility Inventory (All 35 Utilities)

### 1. Color & CSS Foundations
1. **`color-converter`**: Convert and normalize between HEX (3, 4, 6, 8 digit), RGB, RGBA, HSL, and HSLA.
2. **`css-generator`**: Structured generator producing clean CSS rules, multiple selectors, and nested at-rules.
3. **`color-to-tailwind`**: Perceptual CIELAB Delta E matching finding closest Tailwind colors.

### 2. CSS Formatting & Shape Generators
4. **`css-beautify`**: AST-based CSS beautifier preserving comments, custom properties, and at-rules.
5. **`css-border-radius`**: Individual corners, horizontal/vertical elliptical radii, and squircle shape support.
6. **`css-box-shadow`**: Multi-layer box shadow generator with inset and spread validation.
7. **`css-clamp`**: Fluid clamp calculator deriving exact slope, viewport intercepts, and evaluator.
8. **`css-clip-path`**: Generates polygons, circles, ellipses, and inset clipping paths.
9. **`css-container-query`**: Generates container query definitions and matching `@container` rules.
10. **`css-cube`**: Generates 3D CSS cube HTML structure, faces, perspective, and animations.
11. **`css-cubic-bezier`**: Cubic-bezier validation with CSS presets and graph preview points.
12. **`css-filter`**: Ordered CSS filter chains preserving sequence-dependent rendering.

### 3. Layout Generators
13. **`css-flexbox`**: Strictly typed flexbox generator with presets (`center`, `stack`, etc.).
14. **`css-glassmorphism`**: Backdrop blur, background opacity, borders, and vendor prefixes.
15. **`css-gradient`**: Linear, radial, and conic gradients with color stop positions and angles.
16. **`css-gradient-text`**: Reusable gradient text with background-clip and transparent text fill.
17. **`css-grid`**: Grid layouts with track validation (`fr`, `minmax()`, `repeat()`), areas, and gaps.

### 4. Animation & Loading Generators
18. **`css-keyframes`**: Generates valid `@keyframes` and matching `animation` shorthand declarations.
19. **`css-loader`**: Pure CSS loaders (spinner, dots, pulse, bars, ring, bouncing) with reduced-motion support.
20. **`css-media-query`**: Media queries with screen, print, orientation, and breakpoint presets (`sm`, `md`, `lg`, `xl`, `2xl`).

### 5. Styling & Optimization
21. **`css-minify`**: AST-based minifier preserving license comments, custom properties, and data URLs.
22. **`css-neumorphism`**: Dual light/dark shadow generator with raised and pressed styles.
23. **`css-scrollbar`**: Cross-browser scrollbar styles covering standard CSS and WebKit pseudo-elements.
24. **`css-selector-test`**: Static HTML selector tester using Cheerio without executing scripts.
25. **`css-specificity`**: Full W3C specificity calculation supporting `:is()`, `:where()`, `:not()`, `:has()`, `:nth-child()`.
26. **`css-text-shadow`**: Multi-layer text shadow generator with glow, outline, and layered presets.

### 6. CSS Conversion & Transformation
27. **`css-to-react-native`**: Parses CSS declarations into React Native style objects, reporting unsupported declarations.
28. **`css-to-scss`**: Converts flat CSS into nested SCSS using `&` for pseudo-classes and modifiers.
29. **`css-to-tailwind`**: Maps CSS declarations to Tailwind utility classes with arbitrary value support.
30. **`css-transform`**: Sequence-preserving 2D and 3D transform generator.
31. **`css-transition`**: Single and multiple property transition shorthand generator.

### 7. Additional Generators & Compilers
32. **`css-triangle`**: Border-based CSS triangles supporting cardinal and diagonal directions.
33. **`css-unit-convert`**: Context-aware unit converter (`px`, `rem`, `em`, `%`, `vw`, `vh`, `vmin`, `vmax`).
34. **`scss-compile`**: In-memory Dart Sass compiler with detailed source location reporting.
35. **`tailwind-to-css`**: Official Tailwind CSS compiler expanding utility classes into CSS.

---

## API Reference & Examples

### 1. Color Converter
```typescript
import { convertColor, parseColor } from '@rahul_dadhich15/css-toolkit';

const res = convertColor('hsl(200, 100%, 50%)', { format: 'hex' });
// => '#00aaff'

const parsed = parseColor('#3b82f6');
// => { rgb: { r: 59, g: 130, b: 246, a: 1 }, hsl: { h: 217.2, s: 91.2, l: 59.8 }, hex: '#3b82f6', alpha: 1 }
```

### 2. Color to Tailwind
```typescript
import { colorToTailwind } from '@rahul_dadhich15/css-toolkit';

const match = colorToTailwind('#ef4444', { prefix: 'bg-' });
// match.match.className => 'bg-red-500'
// match.match.exact => true
```

### 3. CSS Clamp (Fluid Typography)
```typescript
import { generateClamp } from '@rahul_dadhich15/css-toolkit';

const clamp = generateClamp({
  minSize: 16,
  maxSize: 32,
  minViewport: 320,
  maxViewport: 1120,
});
// clamp.clamp => "clamp(1rem, calc(0.6rem + 2vw), 2rem)"
// clamp.evaluateAt(720) => 1.5rem
```

### 4. CSS Keyframes & Loader
```typescript
import { generateKeyframes, generateLoader } from '@rahul_dadhich15/css-toolkit';

const kf = generateKeyframes({
  name: 'slideIn',
  keyframes: {
    '0%': { transform: 'translateX(-100%)', opacity: 0 },
    '100%': { transform: 'translateX(0)', opacity: 1 },
  },
  animation: { duration: '0.4s', timingFunction: 'ease-out' },
});

const loader = generateLoader({ type: 'spinner', color: '#10b981', size: 48 });
// loader.html => '<div class="loader-spinner"></div>'
// loader.css => contains @keyframes and component styling with prefers-reduced-motion
```

### 5. CSS Specificity Calculator
```typescript
import { calculateSpecificity, compareSpecificity } from '@rahul_dadhich15/css-toolkit';

const specA = calculateSpecificity('.nav > li.active');
// => { inline: 0, ids: 0, classesAttributesPseudoClasses: 2, elementsPseudoElements: 2 }

const comp = compareSpecificity('#header', '.nav > li.active');
// => 1 (first selector has higher specificity)
```

---

## TypeScript Interfaces & Typing

Every module exports its dedicated types:
- `RgbColor`, `HslColor`, `ConvertColorOptions`, `ParsedColor`
- `CssRuleInput`, `GenerateCssOptions`
- `TailwindColorMatch`, `ColorToTailwindOptions`
- `ClampOptions`, `ClampResult`
- `Specificity`
- `UnsupportedDeclaration`, `CssToReactNativeResult`
- `CssToolkitError`, `ErrorCode`

---

## CSS Parser & Serializer Behavior

Parsing is powered by PostCSS AST to preserve syntax integrity:
- Parsing validates standard CSS and detects unclosed blocks or invalid tokens.
- Comments, custom properties (`--primary`), and nested at-rules (`@media`, `@keyframes`, `@container`) are fully preserved.
- Formatting uses deterministic indentation and sorting.

---

## Color Conversion & Perceptual Distance

Colors are validated with strict boundary checks. The `color-to-tailwind` engine uses the standard CIE $L^*a^*b^*$ (D65 illuminant) color space:
$$\Delta E = \sqrt{(\Delta L^*)^2 + (\Delta a^*)^2 + (\Delta b^*)^2}$$
This guarantees that color matches reflect human visual perception rather than simple RGB Euclidean distance or hexadecimal string matching.

---

## Tailwind Integration & Versioning

- **`tailwind-to-css`**: Uses the official `tailwindcss` v3 compiler via PostCSS. Arbitrary values (`w-[123px]`, `bg-[#123456]`), variants (`hover:`, `sm:`), and custom themes are compiled into true CSS rules.
- **`css-to-tailwind`**: Transforms common CSS declarations into Tailwind classes, defaulting to arbitrary values (`p-[13px]`) when exact utility scales do not match.

---

## SCSS Compiler Setup & Isolation

`compileScss` uses pure Dart Sass (`sass.compileString`). It compiles in-memory without invoking shell commands or arbitrary file executions. Errors expose exact lines and columns via `CssToolkitError`.

---

## Browser vs Node Compatibility

| Utility | Browser Compatible | Node Compatible | Subpath Export |
|---|---|---|---|
| Color Utilities | Yes | Yes | `.` |
| Style Generators | Yes | Yes | `.` |
| Specificity & Selector Tester | Yes | Yes | `.` |
| SCSS Compiler | Node | Yes | `.`, `./scss`, `./node` |
| Tailwind Compiler | Node | Yes | `.`, `./tailwind`, `./node` |

---

## Limitations & Non-Supported CSS

### CSS to React Native Limitations
- **Unsupported Selectors**: Pseudo-elements (`::before`), pseudo-classes (`:hover`), and cascaded descendant selectors do not exist in React Native style objects.
- **Unsupported Properties**: `float`, `cursor`, `clip-path`, `grid`, and CSS custom properties are not native styles. They are returned in `unsupported` rather than silently dropped.

### CSS to SCSS Limitations
- Reconstructing original source SCSS from flat CSS is inherently non-invertible. The tool nests shared prefixes and modifiers (`&`, `&:hover`, `&--modifier`), but cannot infer original mixins or abstract variables.

### CSS to Tailwind Limitations
- Custom complex CSS properties without Tailwind equivalents are returned in `unsupported`.

---

## Security & Input Safety

- **No Code Execution**: Never uses `eval()` or `new Function()`.
- **Static HTML Testing**: Selector testing parses static HTML with Cheerio; scripts are never run and network connections are never established.
- **XSS & Injection Protection**: Rejects strings containing `<script`, `javascript:`, or CSS `expression()`.

---

## Performance & Benchmarks

Deterministic benchmarks ensure linear scaling:
- 500 CSS rules are generated in < 15ms.
- 500 rules are beautified in < 50ms and minified in < 40ms.
- 200 comma-separated selectors in specificity calculations parse in < 30ms.

---

## Development, Testing & Coverage

To test and verify the package locally:

```bash
# Install dependencies
npm install

# Run TypeScript typechecking
npm run typecheck

# Run Vitest test suite
npm run test:run

# Run test coverage
npm run test:coverage

# Build package bundles
npm run build

# Dry-run npm pack
npm pack --dry-run
```

Coverage Target:
- Statements: > 90%
- Lines: > 90%
- Functions: 100%
- Branches: > 80%

---

## Contributing

Pull requests are welcome! Please ensure:
1. All changes are written in strict TypeScript.
2. New features or bug fixes have corresponding tests in `tests/`.
3. `npm run typecheck` and `npm run test:run` pass cleanly before submitting.

---

## License

MIT License. Copyright (c) 2026 Rahul Dadhich. See [LICENSE](./LICENSE) for details.

---

## Changelog

### 0.1.0 (2026-11-02)
- Initial release of `@rahul_dadhich15/css-toolkit`.
- Implemented all 35 CSS utilities covering colors, generators, formatters, animations, specificity, transforms, SCSS compilation, and Tailwind integration.
- Configured dual ESM/CJS build with full TypeScript definitions via `tsup`.
- Added complete Vitest test suite with 163 passing tests and > 90% test coverage.
