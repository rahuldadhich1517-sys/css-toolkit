import { formatDimension, escapeHtml, validateIdentifier } from '../internal/validation/index.js';
import { parseColor, convertColor } from '../internal/color/parser.js';

export interface CubeFaces<T> {
  front?: T;
  back?: T;
  left?: T;
  right?: T;
  top?: T;
  bottom?: T;
}

export interface CssCubeOptions {
  size?: number | string;
  perspective?: number | string;
  faceColors?: CubeFaces<string>;
  faceContent?: CubeFaces<string>;
  rotation?: { x?: number; y?: number; z?: number };
  animate?: boolean;
  animationDuration?: number | string;
  className?: string;
}

export interface CssCubeResult {
  html: string;
  css: string;
  faces: Array<'front' | 'back' | 'left' | 'right' | 'top' | 'bottom'>;
}

export function generateCssCube(options?: CssCubeOptions): CssCubeResult {
  const className = options?.className ?? 'cube';
  validateIdentifier(className, 'className');

  const size = options?.size !== undefined ? formatDimension(options.size) : '100px';
  const halfSize = typeof options?.size === 'number'
    ? `${options.size / 2}px`
    : `calc(${size} / 2)`;
  const perspective = options?.perspective !== undefined ? formatDimension(options.perspective) : '800px';

  const defaultColors: Record<string, string> = {
    front: 'rgba(239, 68, 68, 0.7)',
    back: 'rgba(59, 130, 246, 0.7)',
    left: 'rgba(34, 197, 94, 0.7)',
    right: 'rgba(234, 179, 8, 0.7)',
    top: 'rgba(168, 85, 247, 0.7)',
    bottom: 'rgba(236, 72, 153, 0.7)',
  };

  const getFaceColor = (face: keyof CubeFaces<string>): string => {
    const raw = options?.faceColors?.[face];
    if (raw) {
      return convertColor(parseColor(raw).rgb);
    }
    return defaultColors[face]!;
  };

  const getFaceContent = (face: keyof CubeFaces<string>): string => {
    const raw = options?.faceContent?.[face];
    return raw ? escapeHtml(raw) : face.toUpperCase();
  };

  const rotX = options?.rotation?.x ?? 0;
  const rotY = options?.rotation?.y ?? 0;
  const rotZ = options?.rotation?.z ?? 0;
  const initialTransform = `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;

  const animationName = `${className}-rotate`;
  const animDuration = options?.animationDuration !== undefined ? formatDimension(options.animationDuration, 's') : '6s';
  const animDecl = options?.animate ? `\n  animation: ${animationName} ${animDuration} infinite linear;` : '';

  const cssParts: string[] = [
    `.${className}-scene {
  width: ${size};
  height: ${size};
  perspective: ${perspective};
  margin: 0 auto;
}`,
    `.${className} {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transform: ${initialTransform};${animDecl}
}`,
    `.${className}__face {
  position: absolute;
  width: ${size};
  height: ${size};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-family: sans-serif;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.4);
}`,
    `.${className}__face--front  { background: ${getFaceColor('front')};  transform: rotateY(0deg) translateZ(${halfSize}); }`,
    `.${className}__face--back   { background: ${getFaceColor('back')};   transform: rotateY(180deg) translateZ(${halfSize}); }`,
    `.${className}__face--right  { background: ${getFaceColor('right')};  transform: rotateY(90deg) translateZ(${halfSize}); }`,
    `.${className}__face--left   { background: ${getFaceColor('left')};   transform: rotateY(-90deg) translateZ(${halfSize}); }`,
    `.${className}__face--top    { background: ${getFaceColor('top')};    transform: rotateX(90deg) translateZ(${halfSize}); }`,
    `.${className}__face--bottom { background: ${getFaceColor('bottom')}; transform: rotateX(-90deg) translateZ(${halfSize}); }`,
  ];

  if (options?.animate) {
    cssParts.push(`@keyframes ${animationName} {
  0% { transform: rotateX(0deg) rotateY(0deg); }
  100% { transform: rotateX(360deg) rotateY(360deg); }
}`);
  }

  const faces: Array<'front' | 'back' | 'left' | 'right' | 'top' | 'bottom'> = [
    'front',
    'back',
    'right',
    'left',
    'top',
    'bottom',
  ];

  const faceElements = faces
    .map((f) => `    <div class="${className}__face ${className}__face--${f}">${getFaceContent(f)}</div>`)
    .join('\n');

  const html = `<div class="${className}-scene">\n  <div class="${className}">\n${faceElements}\n  </div>\n</div>`;

  return {
    html,
    css: cssParts.join('\n\n'),
    faces,
  };
}
