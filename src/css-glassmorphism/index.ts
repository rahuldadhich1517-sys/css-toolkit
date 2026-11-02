import { formatDimension, validateNumber } from '../internal/validation/index.js';
import { parseColor } from '../internal/color/parser.js';

export interface GlassmorphismBorderOptions {
  width?: number | string;
  color?: string;
  opacity?: number;
}

export interface GlassmorphismShadowOptions {
  blur?: number | string;
  opacity?: number;
}

export interface GlassmorphismOptions {
  backgroundColor?: string;
  backgroundOpacity?: number;
  backdropBlur?: number | string;
  saturation?: number | string;
  border?: boolean | GlassmorphismBorderOptions;
  shadow?: boolean | GlassmorphismShadowOptions;
  borderRadius?: number | string;
  selector?: string;
}

export interface GlassmorphismResult {
  declarations: Record<string, string>;
  css: string;
}

export function generateGlassmorphism(options?: GlassmorphismOptions): GlassmorphismResult {
  const bgRaw = options?.backgroundColor ?? '#ffffff';
  const bgParsed = parseColor(bgRaw);

  const bgOpacity = options?.backgroundOpacity ?? 0.2;
  validateNumber(bgOpacity, 'backgroundOpacity', 0, 1);

  const bgRgba = `rgba(${Math.round(bgParsed.rgb.r)}, ${Math.round(bgParsed.rgb.g)}, ${Math.round(bgParsed.rgb.b)}, ${bgOpacity})`;

  const blur = options?.backdropBlur !== undefined ? formatDimension(options.backdropBlur) : '10px';
  const blurFilter = `blur(${blur})`;

  let backdropFilterVal = blurFilter;
  if (options?.saturation !== undefined) {
    const sat = typeof options.saturation === 'number' ? `${options.saturation}%` : options.saturation;
    backdropFilterVal += ` saturate(${sat})`;
  }

  const decls: Record<string, string> = {
    background: bgRgba,
    '-webkit-backdrop-filter': backdropFilterVal,
    'backdrop-filter': backdropFilterVal,
  };

  if (options?.borderRadius !== undefined) {
    decls['border-radius'] = formatDimension(options.borderRadius);
  }

  // Border
  if (options?.border !== false && options?.border !== undefined) {
    const bOpts = typeof options.border === 'object' ? options.border : {};
    const bWidth = bOpts.width !== undefined ? formatDimension(bOpts.width) : '1px';
    const bColorRaw = bOpts.color ?? '#ffffff';
    const bParsed = parseColor(bColorRaw);
    const bOpacity = bOpts.opacity ?? 0.3;
    validateNumber(bOpacity, 'border.opacity', 0, 1);
    const bRgba = `rgba(${Math.round(bParsed.rgb.r)}, ${Math.round(bParsed.rgb.g)}, ${Math.round(bParsed.rgb.b)}, ${bOpacity})`;
    decls['border'] = `${bWidth} solid ${bRgba}`;
  }

  // Shadow
  if (options?.shadow !== false && options?.shadow !== undefined) {
    const sOpts = typeof options.shadow === 'object' ? options.shadow : {};
    const sBlur = sOpts.blur !== undefined ? formatDimension(sOpts.blur) : '32px';
    const sOpacity = sOpts.opacity ?? 0.1;
    validateNumber(sOpacity, 'shadow.opacity', 0, 1);
    decls['box-shadow'] = `0 8px ${sBlur} 0 rgba(0, 0, 0, ${sOpacity})`;
  }

  const sel = options?.selector;
  const lines = Object.entries(decls).map(([k, v]) => `${sel ? '  ' : ''}${k}: ${v};`);
  const css = sel ? `${sel} {\n${lines.join('\n')}\n}` : lines.join('\n');

  return {
    declarations: decls,
    css,
  };
}
