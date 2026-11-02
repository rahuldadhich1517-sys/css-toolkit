import { formatDimension } from '../internal/validation/index.js';
import { parseColor, convertColor } from '../internal/color/parser.js';
import { CssToolkitError } from '../internal/errors/index.js';

export interface BoxShadowLayer {
  x?: number | string;
  y?: number | string;
  blur?: number | string;
  spread?: number | string;
  color?: string;
  inset?: boolean;
}

export interface BoxShadowResult {
  boxShadow: string;
  css: string;
  layers: BoxShadowLayer[];
}

export function formatShadowLayer(layer: BoxShadowLayer): string {
  if (typeof layer !== 'object' || layer === null) {
    throw new CssToolkitError('Shadow layer must be an object', 'INVALID_SHADOW');
  }

  const x = formatDimension(layer.x ?? 0);
  const y = formatDimension(layer.y ?? 0);
  const blur = formatDimension(layer.blur ?? 0);
  const spread = formatDimension(layer.spread ?? 0);

  let colorStr = 'rgba(0, 0, 0, 0.2)';
  if (layer.color) {
    const parsed = parseColor(layer.color);
    colorStr = convertColor(parsed.rgb);
  }

  const parts: string[] = [];
  if (layer.inset) {
    parts.push('inset');
  }
  parts.push(x, y, blur, spread, colorStr);
  return parts.join(' ');
}

export function generateBoxShadow(
  layers: BoxShadowLayer | BoxShadowLayer[],
  options?: { selector?: string }
): BoxShadowResult {
  const layerArray = Array.isArray(layers) ? layers : [layers];
  if (layerArray.length === 0) {
    return {
      boxShadow: 'none',
      css: 'box-shadow: none;',
      layers: [],
    };
  }

  const formattedLayers = layerArray.map(formatShadowLayer);
  const boxShadow = formattedLayers.join(', ');
  const decl = `box-shadow: ${boxShadow};`;
  const css = options?.selector ? `${options.selector} {\n  ${decl}\n}` : decl;

  return {
    boxShadow,
    css,
    layers: layerArray,
  };
}
