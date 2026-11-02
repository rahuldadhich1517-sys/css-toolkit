import { formatDimension, validateNumber } from '../internal/validation/index.js';
import { parseColor, rgbToHex } from '../internal/color/parser.js';
import { generateBoxShadow, type BoxShadowLayer } from '../css-box-shadow/index.js';

export type NeumorphismStyle = 'flat' | 'raised' | 'pressed';

export interface NeumorphismOptions {
  background?: string;
  distance?: number;
  blur?: number;
  intensity?: number; // 0..1
  borderRadius?: number | string;
  style?: NeumorphismStyle;
  lightColor?: string;
  darkColor?: string;
  selector?: string;
}

export interface NeumorphismResult {
  declarations: Record<string, string>;
  css: string;
  boxShadow: string;
}

export function generateNeumorphism(options?: NeumorphismOptions): NeumorphismResult {
  const bgRaw = options?.background ?? '#e0e0e0';
  const bgParsed = parseColor(bgRaw);
  const distance = options?.distance ?? 8;
  const blur = options?.blur ?? 16;
  validateNumber(distance, 'distance', 0);
  validateNumber(blur, 'blur', 0);

  const style: NeumorphismStyle = options?.style ?? 'raised';
  const isInset = style === 'pressed';

  let lightColor = options?.lightColor;
  let darkColor = options?.darkColor;

  if (!lightColor || !darkColor) {
    const intensity = options?.intensity ?? 0.15;
    validateNumber(intensity, 'intensity', 0, 1);

    // Compute automatic tinted light and dark shadows based on background
    const rgb = bgParsed.rgb;
    const factor = Math.round(intensity * 255);

    if (!lightColor) {
      const lr = Math.min(255, rgb.r + factor);
      const lg = Math.min(255, rgb.g + factor);
      const lb = Math.min(255, rgb.b + factor);
      lightColor = rgbToHex({ r: lr, g: lg, b: lb });
    }

    if (!darkColor) {
      const dr = Math.max(0, rgb.r - factor);
      const dg = Math.max(0, rgb.g - factor);
      const db = Math.max(0, rgb.b - factor);
      darkColor = rgbToHex({ r: dr, g: dg, b: db });
    }
  }

  // Validate colors
  parseColor(lightColor);
  parseColor(darkColor);

  const layers: BoxShadowLayer[] = [
    {
      x: -distance,
      y: -distance,
      blur,
      color: lightColor,
      inset: isInset,
    },
    {
      x: distance,
      y: distance,
      blur,
      color: darkColor,
      inset: isInset,
    },
  ];

  const shadowResult = generateBoxShadow(layers);

  const decls: Record<string, string> = {
    background: bgParsed.hex,
    'box-shadow': shadowResult.boxShadow,
  };

  if (options?.borderRadius !== undefined) {
    decls['border-radius'] = formatDimension(options.borderRadius);
  }

  const sel = options?.selector;
  const lines = Object.entries(decls).map(([k, v]) => `${sel ? '  ' : ''}${k}: ${v};`);
  const css = sel ? `${sel} {\n${lines.join('\n')}\n}` : lines.join('\n');

  return {
    declarations: decls,
    css,
    boxShadow: shadowResult.boxShadow,
  };
}
