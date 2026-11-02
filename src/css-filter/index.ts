import { formatDimension } from '../internal/validation/index.js';
import { parseColor, convertColor } from '../internal/color/parser.js';
import { CssToolkitError } from '../internal/errors/index.js';

export interface DropShadowFilter {
  x?: number | string;
  y?: number | string;
  blur?: number | string;
  color?: string;
}

export type FilterType =
  | 'blur'
  | 'brightness'
  | 'contrast'
  | 'dropShadow'
  | 'grayscale'
  | 'hueRotate'
  | 'invert'
  | 'opacity'
  | 'saturate'
  | 'sepia';

export interface FilterItem {
  type: FilterType;
  value: number | string | DropShadowFilter;
}

export interface FilterNamedOptions {
  blur?: number | string;
  brightness?: number | string;
  contrast?: number | string;
  dropShadow?: DropShadowFilter;
  grayscale?: number | string;
  hueRotate?: number | string;
  invert?: number | string;
  opacity?: number | string;
  saturate?: number | string;
  sepia?: number | string;
}

export interface FilterResult {
  filter: string;
  css: string;
}

function formatPercentOrNumber(val: number | string): string {
  if (typeof val === 'number') {
    if (!Number.isFinite(val)) {
      throw new CssToolkitError(`Invalid filter numeric value: ${val}`, 'INVALID_FILTER');
    }
    return String(val);
  }
  const trimmed = val.trim();
  if (!trimmed) {
    throw new CssToolkitError('Filter value cannot be empty', 'INVALID_FILTER');
  }
  return trimmed;
}

function formatAngle(val: number | string): string {
  if (typeof val === 'number') {
    if (!Number.isFinite(val)) {
      throw new CssToolkitError(`Invalid angle: ${val}`, 'INVALID_FILTER');
    }
    return `${val}deg`;
  }
  return val.trim();
}

function formatSingleFilter(type: FilterType, val: number | string | DropShadowFilter): string {
  switch (type) {
    case 'blur':
      return `blur(${formatDimension(val as number | string)})`;
    case 'brightness':
      return `brightness(${formatPercentOrNumber(val as number | string)})`;
    case 'contrast':
      return `contrast(${formatPercentOrNumber(val as number | string)})`;
    case 'grayscale':
      return `grayscale(${formatPercentOrNumber(val as number | string)})`;
    case 'invert':
      return `invert(${formatPercentOrNumber(val as number | string)})`;
    case 'opacity':
      return `opacity(${formatPercentOrNumber(val as number | string)})`;
    case 'saturate':
      return `saturate(${formatPercentOrNumber(val as number | string)})`;
    case 'sepia':
      return `sepia(${formatPercentOrNumber(val as number | string)})`;
    case 'hueRotate':
      return `hue-rotate(${formatAngle(val as number | string)})`;
    case 'dropShadow': {
      if (typeof val !== 'object' || val === null) {
        throw new CssToolkitError('dropShadow must be an object', 'INVALID_FILTER');
      }
      const ds = val as DropShadowFilter;
      const x = formatDimension(ds.x ?? 0);
      const y = formatDimension(ds.y ?? 0);
      const blur = formatDimension(ds.blur ?? 0);
      let col = 'rgba(0, 0, 0, 0.5)';
      if (ds.color) {
        col = convertColor(parseColor(ds.color).rgb);
      }
      return `drop-shadow(${x} ${y} ${blur} ${col})`;
    }
    default:
      throw new CssToolkitError(`Unsupported filter type: ${String(type)}`, 'INVALID_FILTER');
  }
}

export function generateFilter(options: FilterNamedOptions | FilterItem[]): FilterResult {
  const parts: string[] = [];

  if (Array.isArray(options)) {
    for (const item of options) {
      if (!item || !item.type || item.value === undefined) {
        throw new CssToolkitError('Filter array item must contain type and value', 'INVALID_FILTER');
      }
      parts.push(formatSingleFilter(item.type, item.value));
    }
  } else if (typeof options === 'object' && options !== null) {
    const keys: FilterType[] = [
      'blur',
      'brightness',
      'contrast',
      'grayscale',
      'hueRotate',
      'invert',
      'opacity',
      'saturate',
      'sepia',
      'dropShadow',
    ];
    for (const k of keys) {
      const val = options[k];
      if (val !== undefined) {
        parts.push(formatSingleFilter(k, val));
      }
    }
  } else {
    throw new CssToolkitError('Options must be a filter object or array of filter items', 'INVALID_FILTER');
  }

  const filter = parts.length > 0 ? parts.join(' ') : 'none';
  return {
    filter,
    css: `filter: ${filter};`,
  };
}
