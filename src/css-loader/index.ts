import { formatDimension, validateIdentifier } from '../internal/validation/index.js';
import { parseColor, convertColor } from '../internal/color/parser.js';
import { generateKeyframes } from '../css-keyframes/index.js';
import { CssToolkitError } from '../internal/errors/index.js';

export type LoaderType = 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring' | 'bouncing';

export interface LoaderOptions {
  type?: LoaderType;
  size?: number | string;
  color?: string;
  speed?: number | string;
  items?: number;
  reducedMotion?: boolean;
  className?: string;
}

export interface LoaderResult {
  html: string;
  css: string;
  type: LoaderType;
}

export function generateLoader(options?: LoaderOptions): LoaderResult {
  const type: LoaderType = options?.type ?? 'spinner';
  const className = options?.className ?? `loader-${type}`;
  validateIdentifier(className, 'className');

  const size = options?.size !== undefined ? formatDimension(options.size) : '40px';
  const colorParsed = parseColor(options?.color ?? '#3b82f6');
  const color = convertColor(colorParsed.rgb);
  const speed = options?.speed !== undefined ? formatDimension(options.speed, 's') : '1s';
  const reducedMotion = options?.reducedMotion ?? true;

  let html = '';
  const cssBlocks: string[] = [];

  switch (type) {
    case 'spinner': {
      const kf = generateKeyframes({
        name: `${className}-spin`,
        keyframes: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      });
      cssBlocks.push(kf.keyframesCss);
      cssBlocks.push(`.${className} {
  width: ${size};
  height: ${size};
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: ${color};
  border-radius: 50%;
  animation: ${className}-spin ${speed} linear infinite;
  box-sizing: border-box;
}`);
      html = `<div class="${className}"></div>`;
      break;
    }

    case 'ring': {
      const kf = generateKeyframes({
        name: `${className}-ring`,
        keyframes: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      });
      cssBlocks.push(kf.keyframesCss);
      cssBlocks.push(`.${className} {
  display: inline-block;
  width: ${size};
  height: ${size};
}
.${className}:after {
  content: " ";
  display: block;
  width: 80%;
  height: 80%;
  margin: 10%;
  border-radius: 50%;
  border: 4px solid ${color};
  border-color: ${color} transparent ${color} transparent;
  animation: ${className}-ring ${speed} linear infinite;
}`);
      html = `<div class="${className}"></div>`;
      break;
    }

    case 'pulse': {
      const kf = generateKeyframes({
        name: `${className}-pulse`,
        keyframes: {
          '0%': { transform: 'scale(0.8)', opacity: 0.5 },
          '50%': { transform: 'scale(1.2)', opacity: 1 },
          '100%': { transform: 'scale(0.8)', opacity: 0.5 },
        },
      });
      cssBlocks.push(kf.keyframesCss);
      cssBlocks.push(`.${className} {
  width: ${size};
  height: ${size};
  background-color: ${color};
  border-radius: 50%;
  animation: ${className}-pulse ${speed} ease-in-out infinite;
}`);
      html = `<div class="${className}"></div>`;
      break;
    }

    case 'dots': {
      const itemsCount = options?.items ?? 3;
      if (itemsCount < 2 || itemsCount > 10) {
        throw new CssToolkitError('items must be between 2 and 10 for dots loader', 'INVALID_PROPERTY');
      }
      const kf = generateKeyframes({
        name: `${className}-bounce`,
        keyframes: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0)' },
        },
      });
      cssBlocks.push(kf.keyframesCss);
      cssBlocks.push(`.${className} {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.${className}__dot {
  width: calc(${size} / 3);
  height: calc(${size} / 3);
  background-color: ${color};
  border-radius: 50%;
  animation: ${className}-bounce ${speed} infinite ease-in-out both;
}`);

      const dotSpans: string[] = [];
      for (let i = 0; i < itemsCount; i++) {
        const delay = (i * 0.16).toFixed(2);
        cssBlocks.push(`.${className}__dot:nth-child(${i + 1}) { animation-delay: ${delay}s; }`);
        dotSpans.push(`  <span class="${className}__dot"></span>`);
      }
      html = `<div class="${className}">\n${dotSpans.join('\n')}\n</div>`;
      break;
    }

    case 'bars': {
      const itemsCount = options?.items ?? 4;
      const kf = generateKeyframes({
        name: `${className}-scale`,
        keyframes: {
          '0%': { transform: 'scaleY(0.4)' },
          '20%': { transform: 'scaleY(1)' },
          '40%': { transform: 'scaleY(0.4)' },
          '100%': { transform: 'scaleY(0.4)' },
        },
      });
      cssBlocks.push(kf.keyframesCss);
      cssBlocks.push(`.${className} {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: ${size};
}
.${className}__bar {
  width: calc(${size} / 8);
  height: 100%;
  background-color: ${color};
  animation: ${className}-scale ${speed} infinite ease-in-out;
}`);
      const barSpans: string[] = [];
      for (let i = 0; i < itemsCount; i++) {
        const delay = (i * 0.15).toFixed(2);
        cssBlocks.push(`.${className}__bar:nth-child(${i + 1}) { animation-delay: ${delay}s; }`);
        barSpans.push(`  <span class="${className}__bar"></span>`);
      }
      html = `<div class="${className}">\n${barSpans.join('\n')}\n</div>`;
      break;
    }

    case 'bouncing': {
      const kf = generateKeyframes({
        name: `${className}-jump`,
        keyframes: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(0)' },
        },
      });
      cssBlocks.push(kf.keyframesCss);
      cssBlocks.push(`.${className} {
  width: ${size};
  height: ${size};
  background-color: ${color};
  border-radius: 50%;
  animation: ${className}-jump ${speed} infinite ease-in-out;
}`);
      html = `<div class="${className}"></div>`;
      break;
    }

    default:
      throw new CssToolkitError(`Unsupported loader type: ${String(type)}`, 'INVALID_PROPERTY');
  }

  if (reducedMotion) {
    cssBlocks.push(`@media (prefers-reduced-motion: reduce) {
  .${className}, .${className} * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`);
  }

  return {
    html,
    css: cssBlocks.join('\n\n'),
    type,
  };
}
