import { formatDimension } from '../internal/validation/index.js';
import { parseColor, convertColor } from '../internal/color/parser.js';
import { CssToolkitError } from '../internal/errors/index.js';

export interface TextShadowLayer {
  x?: number | string;
  y?: number | string;
  blur?: number | string;
  color?: string;
}

export type TextShadowPreset = 'glow' | 'outline' | 'subtle' | 'layered';

export interface TextShadowOptions {
  layers?: TextShadowLayer | TextShadowLayer[];
  preset?: TextShadowPreset;
  color?: string;
  selector?: string;
}

export interface TextShadowResult {
  textShadow: string;
  css: string;
  layers: TextShadowLayer[];
}

function formatTextShadowLayer(layer: TextShadowLayer): string {
  if (typeof layer !== 'object' || layer === null) {
    throw new CssToolkitError('Text shadow layer must be an object', 'INVALID_SHADOW');
  }

  const x = formatDimension(layer.x ?? 0);
  const y = formatDimension(layer.y ?? 0);
  const blur = formatDimension(layer.blur ?? 0);

  let col = 'rgba(0, 0, 0, 0.5)';
  if (layer.color) {
    const parsed = parseColor(layer.color);
    col = convertColor(parsed.rgb);
  }

  return `${x} ${y} ${blur} ${col}`;
}

export function generateTextShadow(options?: TextShadowOptions): TextShadowResult {
  let layerList: TextShadowLayer[] = [];

  if (options?.preset) {
    const col = options.color ?? '#3b82f6';
    switch (options.preset) {
      case 'glow':
        layerList = [
          { x: 0, y: 0, blur: 5, color: col },
          { x: 0, y: 0, blur: 10, color: col },
          { x: 0, y: 0, blur: 20, color: col },
        ];
        break;
      case 'outline':
        layerList = [
          { x: -1, y: -1, blur: 0, color: col },
          { x: 1, y: -1, blur: 0, color: col },
          { x: -1, y: 1, blur: 0, color: col },
          { x: 1, y: 1, blur: 0, color: col },
        ];
        break;
      case 'subtle':
        layerList = [{ x: 1, y: 1, blur: 2, color: 'rgba(0, 0, 0, 0.3)' }];
        break;
      case 'layered':
        layerList = [
          { x: 1, y: 1, blur: 1, color: 'rgba(0, 0, 0, 0.4)' },
          { x: 3, y: 3, blur: 4, color: 'rgba(0, 0, 0, 0.2)' },
        ];
        break;
    }
  } else if (options?.layers) {
    layerList = Array.isArray(options.layers) ? options.layers : [options.layers];
  }

  if (layerList.length === 0) {
    return {
      textShadow: 'none',
      css: 'text-shadow: none;',
      layers: [],
    };
  }

  const formatted = layerList.map(formatTextShadowLayer).join(', ');
  const decl = `text-shadow: ${formatted};`;
  const css = options?.selector ? `${options.selector} {\n  ${decl}\n}` : decl;

  return {
    textShadow: formatted,
    css,
    layers: layerList,
  };
}
