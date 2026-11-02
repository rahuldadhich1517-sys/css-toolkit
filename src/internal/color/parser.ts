import { CssToolkitError } from '../errors/index.js';
import type { RgbColor, HslColor, ParsedColor, ConvertColorOptions } from './types.js';

const NAMED_COLORS: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  red: '#ff0000',
  green: '#008000',
  blue: '#0000ff',
  yellow: '#ffff00',
  cyan: '#00ffff',
  magenta: '#ff00ff',
  gray: '#808080',
  grey: '#808080',
  transparent: '#00000000',
  orange: '#ffa500',
  purple: '#800080',
  pink: '#ffc0cb',
  lime: '#00ff00',
  navy: '#000080',
  teal: '#008080',
  maroon: '#800000',
  olive: '#808000',
  silver: '#c0c0c0',
};

const HEX_REGEX = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function checkChannel(val: number, name: string, min: number, max: number, clamp = false): number {
  if (!Number.isFinite(val)) {
    throw new CssToolkitError(`Channel ${name} must be a finite number, received ${val}`, 'INVALID_COLOR');
  }
  if (val < min || val > max) {
    if (clamp) {
      return Math.min(Math.max(val, min), max);
    }
    throw new CssToolkitError(`Channel ${name} (${val}) out of range [${min}, ${max}]`, 'INVALID_COLOR');
  }
  return val;
}

export function parseHex(hexStr: string, clamp = false): { rgb: RgbColor; hex: string } {
  const trimmed = hexStr.trim();
  if (!HEX_REGEX.test(trimmed)) {
    throw new CssToolkitError(`Invalid HEX color: "${hexStr}"`, 'INVALID_COLOR');
  }

  const raw = trimmed.slice(1);
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 1;

  if (raw.length === 3 || raw.length === 4) {
    const ch0 = raw[0]!;
    const ch1 = raw[1]!;
    const ch2 = raw[2]!;
    r = parseInt(ch0 + ch0, 16);
    g = parseInt(ch1 + ch1, 16);
    b = parseInt(ch2 + ch2, 16);
    if (raw.length === 4) {
      const ch3 = raw[3]!;
      a = Math.round((parseInt(ch3 + ch3, 16) / 255) * 1000) / 1000;
    }
  } else if (raw.length === 6 || raw.length === 8) {
    r = parseInt(raw.slice(0, 2), 16);
    g = parseInt(raw.slice(2, 4), 16);
    b = parseInt(raw.slice(4, 6), 16);
    if (raw.length === 8) {
      a = Math.round((parseInt(raw.slice(6, 8), 16) / 255) * 1000) / 1000;
    }
  }

  r = checkChannel(r, 'r', 0, 255, clamp);
  g = checkChannel(g, 'g', 0, 255, clamp);
  b = checkChannel(b, 'b', 0, 255, clamp);
  a = checkChannel(a, 'a', 0, 1, clamp);

  const normalizedHex = rgbToHex({ r, g, b, a });
  return { rgb: { r, g, b, a }, hex: normalizedHex };
}

function parseChannelValue(valStr: string, isPercentAllowed = true, base = 255): number {
  const trimmed = valStr.trim();
  if (isPercentAllowed && trimmed.endsWith('%')) {
    const num = parseFloat(trimmed.slice(0, -1));
    return (num / 100) * base;
  }
  return parseFloat(trimmed);
}

function parseAlphaValue(valStr: string): number {
  const trimmed = valStr.trim();
  if (trimmed.endsWith('%')) {
    return parseFloat(trimmed.slice(0, -1)) / 100;
  }
  return parseFloat(trimmed);
}

export function parseRgbString(rgbStr: string, clamp = false): RgbColor {
  const trimmed = rgbStr.trim();
  const match = /^rgba?\s*\(\s*(.+)\s*\)$/i.exec(trimmed);
  if (!match || !match[1]) {
    throw new CssToolkitError(`Invalid RGB/RGBA color string: "${rgbStr}"`, 'INVALID_COLOR');
  }

  const inner = match[1].trim();
  let parts: string[];

  if (inner.includes(',')) {
    parts = inner.split(',').map((s) => s.trim());
    if (parts.length !== 3 && parts.length !== 4) {
      throw new CssToolkitError(`RGB/RGBA requires 3 or 4 comma-separated values, got ${parts.length}`, 'INVALID_COLOR');
    }
  } else {
    // Space-separated modern syntax: rgb(255 0 0 / 0.5)
    const slashSplit = inner.split('/');
    const colorParts = (slashSplit[0] ?? '').trim().split(/\s+/);
    if (colorParts.length !== 3) {
      throw new CssToolkitError(`RGB modern syntax requires 3 space-separated channels`, 'INVALID_COLOR');
    }
    parts = [...colorParts];
    if (slashSplit[1] !== undefined) {
      parts.push(slashSplit[1].trim());
    }
  }

  const p0 = parts[0]!;
  const p1 = parts[1]!;
  const p2 = parts[2]!;

  const r = checkChannel(parseChannelValue(p0, true, 255), 'r', 0, 255, clamp);
  const g = checkChannel(parseChannelValue(p1, true, 255), 'g', 0, 255, clamp);
  const b = checkChannel(parseChannelValue(p2, true, 255), 'b', 0, 255, clamp);

  let a = 1;
  const p3 = parts[3];
  if (p3 !== undefined) {
    a = checkChannel(parseAlphaValue(p3), 'a', 0, 1, clamp);
  }

  return { r: Math.round(r * 100) / 100, g: Math.round(g * 100) / 100, b: Math.round(b * 100) / 100, a };
}

export function parseHslString(hslStr: string, clamp = false): HslColor {
  const trimmed = hslStr.trim();
  const match = /^hsla?\s*\(\s*(.+)\s*\)$/i.exec(trimmed);
  if (!match || !match[1]) {
    throw new CssToolkitError(`Invalid HSL/HSLA color string: "${hslStr}"`, 'INVALID_COLOR');
  }

  const inner = match[1].trim();
  let parts: string[];

  if (inner.includes(',')) {
    parts = inner.split(',').map((s) => s.trim());
    if (parts.length !== 3 && parts.length !== 4) {
      throw new CssToolkitError(`HSL/HSLA requires 3 or 4 comma-separated values, got ${parts.length}`, 'INVALID_COLOR');
    }
  } else {
    const slashSplit = inner.split('/');
    const colorParts = (slashSplit[0] ?? '').trim().split(/\s+/);
    if (colorParts.length !== 3) {
      throw new CssToolkitError(`HSL modern syntax requires 3 space-separated channels`, 'INVALID_COLOR');
    }
    parts = [...colorParts];
    if (slashSplit[1] !== undefined) {
      parts.push(slashSplit[1].trim());
    }
  }

  const hStr = parts[0]!;
  let h = 0;
  if (hStr.endsWith('deg')) {
    h = parseFloat(hStr.slice(0, -3));
  } else if (hStr.endsWith('turn')) {
    h = parseFloat(hStr.slice(0, -4)) * 360;
  } else if (hStr.endsWith('rad')) {
    h = (parseFloat(hStr.slice(0, -3)) * 180) / Math.PI;
  } else {
    h = parseFloat(hStr);
  }

  if (!Number.isFinite(h)) {
    throw new CssToolkitError(`Hue must be a finite number: "${hStr}"`, 'INVALID_COLOR');
  }
  // Normalize hue into [0, 360)
  h = ((h % 360) + 360) % 360;

  const sStr = parts[1]!;
  const lStr = parts[2]!;

  if (!sStr.endsWith('%') || !lStr.endsWith('%')) {
    throw new CssToolkitError(`Saturation and Lightness must be percentage values: "${sStr}", "${lStr}"`, 'INVALID_COLOR');
  }

  const s = checkChannel(parseFloat(sStr.slice(0, -1)), 's', 0, 100, clamp);
  const l = checkChannel(parseFloat(lStr.slice(0, -1)), 'l', 0, 100, clamp);

  let a = 1;
  const aStr = parts[3];
  if (aStr !== undefined) {
    a = checkChannel(parseAlphaValue(aStr), 'a', 0, 1, clamp);
  }

  return { h: Math.round(h * 100) / 100, s: Math.round(s * 100) / 100, l: Math.round(l * 100) / 100, a };
}

export function rgbToHex(rgb: RgbColor): string {
  const r = Math.round(checkChannel(rgb.r, 'r', 0, 255));
  const g = Math.round(checkChannel(rgb.g, 'g', 0, 255));
  const b = Math.round(checkChannel(rgb.b, 'b', 0, 255));

  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');

  if (rgb.a !== undefined && rgb.a < 1) {
    const a = checkChannel(rgb.a, 'a', 0, 1);
    const alphaHex = Math.round(a * 255)
      .toString(16)
      .padStart(2, '0');
    return `#${hexR}${hexG}${hexB}${alphaHex}`;
  }

  return `#${hexR}${hexG}${hexB}`;
}

export function hexToRgb(hex: string): RgbColor {
  return parseHex(hex).rgb;
}

export function rgbToHsl(rgb: RgbColor): HslColor {
  const r = checkChannel(rgb.r, 'r', 0, 255) / 255;
  const g = checkChannel(rgb.g, 'g', 0, 255) / 255;
  const b = checkChannel(rgb.b, 'b', 0, 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / delta + 2) * 60;
        break;
      case b:
        h = ((r - g) / delta + 4) * 60;
        break;
    }
  }

  const result: HslColor = {
    h: Math.round(h * 10) / 10,
    s: Math.round(s * 1000) / 10,
    l: Math.round(l * 1000) / 10,
  };

  if (rgb.a !== undefined) {
    result.a = checkChannel(rgb.a, 'a', 0, 1);
  }

  return result;
}

export function hslToRgb(hsl: HslColor): RgbColor {
  let h = ((hsl.h % 360) + 360) % 360;
  const s = checkChannel(hsl.s, 's', 0, 100) / 100;
  const l = checkChannel(hsl.l, 'l', 0, 100) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (h >= 0 && h < 60) {
    rPrime = c;
    gPrime = x;
    bPrime = 0;
  } else if (h >= 60 && h < 120) {
    rPrime = x;
    gPrime = c;
    bPrime = 0;
  } else if (h >= 120 && h < 180) {
    rPrime = 0;
    gPrime = c;
    bPrime = x;
  } else if (h >= 180 && h < 240) {
    rPrime = 0;
    gPrime = x;
    bPrime = c;
  } else if (h >= 240 && h < 300) {
    rPrime = x;
    gPrime = 0;
    bPrime = c;
  } else if (h >= 300 && h < 360) {
    rPrime = c;
    gPrime = 0;
    bPrime = x;
  }

  const result: RgbColor = {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255),
  };

  if (hsl.a !== undefined) {
    result.a = checkChannel(hsl.a, 'a', 0, 1);
  }

  return result;
}

export function parseColor(input: string | RgbColor | HslColor, options?: { clamp?: boolean }): ParsedColor {
  const clamp = options?.clamp ?? false;

  if (typeof input === 'object' && input !== null) {
    if ('r' in input && 'g' in input && 'b' in input) {
      const rgb: RgbColor = {
        r: checkChannel(input.r, 'r', 0, 255, clamp),
        g: checkChannel(input.g, 'g', 0, 255, clamp),
        b: checkChannel(input.b, 'b', 0, 255, clamp),
        a: input.a !== undefined ? checkChannel(input.a, 'a', 0, 1, clamp) : 1,
      };
      const hex = rgbToHex(rgb);
      const hsl = rgbToHsl(rgb);
      return { rgb, hsl, hex, alpha: rgb.a ?? 1 };
    }

    if ('h' in input && 's' in input && 'l' in input) {
      const hsl: HslColor = {
        h: ((input.h % 360) + 360) % 360,
        s: checkChannel(input.s, 's', 0, 100, clamp),
        l: checkChannel(input.l, 'l', 0, 100, clamp),
        a: input.a !== undefined ? checkChannel(input.a, 'a', 0, 1, clamp) : 1,
      };
      const rgb = hslToRgb(hsl);
      const hex = rgbToHex(rgb);
      return { rgb, hsl, hex, alpha: hsl.a ?? 1 };
    }

    throw new CssToolkitError('Input object must be RgbColor or HslColor', 'INVALID_COLOR');
  }

  if (typeof input !== 'string') {
    throw new CssToolkitError(`Color input must be string or object, got ${typeof input}`, 'INVALID_COLOR');
  }

  const trimmed = input.trim();
  if (!trimmed) {
    throw new CssToolkitError('Color string cannot be empty', 'INVALID_COLOR');
  }

  const lower = trimmed.toLowerCase();
  if (lower in NAMED_COLORS) {
    return parseColor(NAMED_COLORS[lower]!, options);
  }

  if (trimmed.startsWith('#')) {
    const { rgb, hex } = parseHex(trimmed, clamp);
    const hsl = rgbToHsl(rgb);
    return { rgb, hsl, hex, alpha: rgb.a ?? 1 };
  }

  if (lower.startsWith('rgb')) {
    const rgb = parseRgbString(trimmed, clamp);
    const hex = rgbToHex(rgb);
    const hsl = rgbToHsl(rgb);
    return { rgb, hsl, hex, alpha: rgb.a ?? 1 };
  }

  if (lower.startsWith('hsl')) {
    const hsl = parseHslString(trimmed, clamp);
    const rgb = hslToRgb(hsl);
    const hex = rgbToHex(rgb);
    return { rgb, hsl, hex, alpha: hsl.a ?? 1 };
  }

  throw new CssToolkitError(`Unsupported or malformed color syntax: "${input}"`, 'INVALID_COLOR');
}

export function convertColor(
  input: string | RgbColor | HslColor,
  options?: ConvertColorOptions
): string {
  const parsed = parseColor(input, { clamp: options?.clamp });
  const format = options?.format ?? (parsed.alpha < 1 ? 'rgba' : 'hex');
  const precision = options?.precision ?? 2;

  switch (format) {
    case 'hex':
      return parsed.hex;
    case 'rgb':
      return `rgb(${Math.round(parsed.rgb.r)}, ${Math.round(parsed.rgb.g)}, ${Math.round(parsed.rgb.b)})`;
    case 'rgba':
      return `rgba(${Math.round(parsed.rgb.r)}, ${Math.round(parsed.rgb.g)}, ${Math.round(parsed.rgb.b)}, ${parsed.alpha})`;
    case 'hsl': {
      const h = Number(parsed.hsl.h.toFixed(precision));
      const s = Number(parsed.hsl.s.toFixed(precision));
      const l = Number(parsed.hsl.l.toFixed(precision));
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
    case 'hsla': {
      const h = Number(parsed.hsl.h.toFixed(precision));
      const s = Number(parsed.hsl.s.toFixed(precision));
      const l = Number(parsed.hsl.l.toFixed(precision));
      return `hsla(${h}, ${s}%, ${l}%, ${parsed.alpha})`;
    }
    default:
      throw new CssToolkitError(`Unsupported target format: ${String(format)}`, 'INVALID_COLOR');
  }
}
