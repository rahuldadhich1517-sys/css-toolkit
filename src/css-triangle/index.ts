import { formatDimension, validateNumber } from '../internal/validation/index.js';
import { parseColor, convertColor } from '../internal/color/parser.js';
import { CssToolkitError } from '../internal/errors/index.js';

export type TriangleDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface TriangleOptions {
  direction?: TriangleDirection;
  width?: number | string;
  height?: number | string;
  color?: string;
  selector?: string;
}

export interface TriangleResult {
  declarations: Record<string, string>;
  css: string;
  direction: TriangleDirection;
}

export function generateTriangle(options?: TriangleOptions): TriangleResult {
  const direction: TriangleDirection = options?.direction ?? 'up';
  const widthRaw = options?.width ?? 20;
  const heightRaw = options?.height ?? 20;

  if (typeof widthRaw === 'number') {
    validateNumber(widthRaw, 'width', 0.1);
  }
  if (typeof heightRaw === 'number') {
    validateNumber(heightRaw, 'height', 0.1);
  }

  const halfWidth = typeof widthRaw === 'number'
    ? `${widthRaw / 2}px`
    : `calc(${formatDimension(widthRaw)} / 2)`;
  const height = formatDimension(heightRaw);
  const width = formatDimension(widthRaw);
  const halfHeight = typeof heightRaw === 'number'
    ? `${heightRaw / 2}px`
    : `calc(${formatDimension(heightRaw)} / 2)`;

  const colorRaw = options?.color ?? '#000000';
  const parsedColor = parseColor(colorRaw);
  const color = convertColor(parsedColor.rgb);

  const decls: Record<string, string> = {
    width: '0',
    height: '0',
    'border-style': 'solid',
  };

  switch (direction) {
    case 'up':
      decls['border-width'] = `0 ${halfWidth} ${height} ${halfWidth}`;
      decls['border-color'] = `transparent transparent ${color} transparent`;
      break;
    case 'down':
      decls['border-width'] = `${height} ${halfWidth} 0 ${halfWidth}`;
      decls['border-color'] = `${color} transparent transparent transparent`;
      break;
    case 'left':
      decls['border-width'] = `${halfHeight} ${width} ${halfHeight} 0`;
      decls['border-color'] = `transparent ${color} transparent transparent`;
      break;
    case 'right':
      decls['border-width'] = `${halfHeight} 0 ${halfHeight} ${width}`;
      decls['border-color'] = `transparent transparent transparent ${color}`;
      break;
    case 'top-left':
      decls['border-width'] = `${height} ${width} 0 0`;
      decls['border-color'] = `${color} transparent transparent transparent`;
      break;
    case 'top-right':
      decls['border-width'] = `0 ${width} ${height} 0`;
      decls['border-color'] = `transparent ${color} transparent transparent`;
      break;
    case 'bottom-left':
      decls['border-width'] = `${height} 0 0 ${width}`;
      decls['border-color'] = `transparent transparent transparent ${color}`;
      break;
    case 'bottom-right':
      decls['border-width'] = `0 0 ${height} ${width}`;
      decls['border-color'] = `transparent transparent ${color} transparent`;
      break;
    default:
      throw new CssToolkitError(`Unsupported triangle direction: ${String(direction)}`, 'INVALID_PROPERTY');
  }

  const sel = options?.selector;
  const lines = Object.entries(decls).map(([k, v]) => `${sel ? '  ' : ''}${k}: ${v};`);
  const css = sel ? `${sel} {\n${lines.join('\n')}\n}` : lines.join('\n');

  return {
    declarations: decls,
    css,
    direction,
  };
}
