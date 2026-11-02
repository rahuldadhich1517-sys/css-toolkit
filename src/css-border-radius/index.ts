import { formatDimension, validateNumber } from '../internal/validation/index.js';
import { CssToolkitError } from '../internal/errors/index.js';

export interface CornerRadius {
  topLeft?: number | string;
  topRight?: number | string;
  bottomRight?: number | string;
  bottomLeft?: number | string;
}

export interface EllipticalRadius {
  horizontal: number | string | CornerRadius;
  vertical: number | string | CornerRadius;
}

export interface BorderRadiusOptions {
  radius?: number | string | CornerRadius;
  elliptical?: EllipticalRadius;
  squircle?: boolean;
}

export interface BorderRadiusResult {
  borderRadius: string;
  cornerShape?: string;
  declarations: Record<string, string>;
  css: string;
}

function parseCornerGroup(group: number | string | CornerRadius): {
  tl: string;
  tr: string;
  br: string;
  bl: string;
} {
  if (typeof group === 'number') {
    validateNumber(group, 'radius', 0);
    const d = formatDimension(group);
    return { tl: d, tr: d, br: d, bl: d };
  }
  if (typeof group === 'string') {
    const d = formatDimension(group);
    return { tl: d, tr: d, br: d, bl: d };
  }
  if (typeof group === 'object' && group !== null) {
    const tl = formatDimension(group.topLeft ?? 0);
    const tr = formatDimension(group.topRight ?? 0);
    const br = formatDimension(group.bottomRight ?? 0);
    const bl = formatDimension(group.bottomLeft ?? 0);
    return { tl, tr, br, bl };
  }
  throw new CssToolkitError('Invalid radius specification', 'INVALID_BORDER_RADIUS');
}

function compactShorthand(tl: string, tr: string, br: string, bl: string): string {
  if (tl === tr && tr === br && br === bl) {
    return tl;
  }
  if (tl === br && tr === bl) {
    return `${tl} ${tr}`;
  }
  if (tr === bl) {
    return `${tl} ${tr} ${br}`;
  }
  return `${tl} ${tr} ${br} ${bl}`;
}

export function generateBorderRadius(options?: BorderRadiusOptions): BorderRadiusResult {
  let borderRadiusValue = '0';
  const declarations: Record<string, string> = {};

  if (options?.elliptical) {
    const h = parseCornerGroup(options.elliptical.horizontal);
    const v = parseCornerGroup(options.elliptical.vertical);
    const hStr = compactShorthand(h.tl, h.tr, h.br, h.bl);
    const vStr = compactShorthand(v.tl, v.tr, v.br, v.bl);
    borderRadiusValue = `${hStr} / ${vStr}`;
  } else if (options?.radius !== undefined) {
    const r = parseCornerGroup(options.radius);
    borderRadiusValue = compactShorthand(r.tl, r.tr, r.br, r.bl);
  }

  declarations['border-radius'] = borderRadiusValue;

  let cornerShape: string | undefined;
  if (options?.squircle) {
    cornerShape = 'squircle';
    declarations['corner-shape'] = 'squircle';
  }

  const css = Object.entries(declarations)
    .map(([k, v]) => `${k}: ${v};`)
    .join('\n');

  return {
    borderRadius: borderRadiusValue,
    cornerShape,
    declarations,
    css,
  };
}
