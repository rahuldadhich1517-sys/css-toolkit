import { parseColor } from '../internal/color/parser.js';
import { rgbToLab, deltaE } from '../internal/color/lab.js';
import {
  TAILWIND_V3_PALETTE,
  flattenPalette,
  type TailwindPaletteColor,
} from '../internal/tailwind/palette.js';
import type { RgbColor } from '../internal/color/types.js';

export interface TailwindColorMatch {
  className: string;
  name: string;
  shade?: string;
  hex: string;
  distance: number;
  exact: boolean;
}

export interface ColorToTailwindOptions {
  palette?: Record<string, Record<string, string> | string>;
  version?: 'v3' | 'v4';
  maxDistance?: number;
  candidates?: number;
  prefix?: string;
}

export interface ColorToTailwindResult {
  match: TailwindColorMatch | null;
  candidates: TailwindColorMatch[];
  original: {
    hex: string;
    rgb: RgbColor;
    alpha: number;
  };
}

export function colorToTailwind(
  color: string | RgbColor,
  options?: ColorToTailwindOptions
): ColorToTailwindResult {
  const parsed = parseColor(color);
  const prefix = options?.prefix ?? '';
  const paletteRaw = options?.palette ?? TAILWIND_V3_PALETTE;
  const paletteList = flattenPalette(paletteRaw);
  const maxDistance = options?.maxDistance;
  const numCandidates = Math.max(1, options?.candidates ?? 1);

  const inputLab = rgbToLab(parsed.rgb);

  const evaluated: TailwindColorMatch[] = paletteList.map((item: TailwindPaletteColor) => {
    const itemParsed = parseColor(item.hex);
    const itemLab = rgbToLab(itemParsed.rgb);
    const dist = Math.round(deltaE(inputLab, itemLab) * 100) / 100;
    const colorIdentifier = item.shade ? `${item.name}-${item.shade}` : item.name;
    const className = prefix ? `${prefix}${colorIdentifier}` : colorIdentifier;

    return {
      className,
      name: item.name,
      shade: item.shade,
      hex: item.hex,
      distance: dist,
      exact: dist === 0,
    };
  });

  evaluated.sort((a, b) => a.distance - b.distance);

  const filtered = maxDistance !== undefined
    ? evaluated.filter((c) => c.distance <= maxDistance)
    : evaluated;

  const candidateList = filtered.slice(0, numCandidates);
  const topMatch = candidateList[0] ?? null;

  return {
    match: topMatch,
    candidates: candidateList,
    original: {
      hex: parsed.hex,
      rgb: parsed.rgb,
      alpha: parsed.alpha,
    },
  };
}
