import { CssToolkitError } from '../internal/errors/index.js';
import { validateNumber } from '../internal/validation/index.js';

export interface ClampOptions {
  minSize: number;
  maxSize: number;
  minViewport: number;
  maxViewport: number;
  rootFontSize?: number;
  unit?: 'rem' | 'px';
  precision?: number;
}

export interface ClampResult {
  clamp: string;
  css: string;
  min: string;
  preferred: string;
  max: string;
  slope: number;
  intercept: number;
  evaluateAt: (viewportWidth: number) => number;
}

export function generateClamp(options: ClampOptions): ClampResult {
  validateNumber(options.minSize, 'minSize');
  validateNumber(options.maxSize, 'maxSize');
  validateNumber(options.minViewport, 'minViewport', 1);
  validateNumber(options.maxViewport, 'maxViewport', 1);

  if (options.minViewport >= options.maxViewport) {
    throw new CssToolkitError(
      `minViewport (${options.minViewport}) must be strictly less than maxViewport (${options.maxViewport})`,
      'INVALID_CLAMP'
    );
  }

  const rootFontSize = options.rootFontSize ?? 16;
  if (rootFontSize <= 0) {
    throw new CssToolkitError('rootFontSize must be greater than 0', 'INVALID_CLAMP');
  }

  const precision = options.precision ?? 4;
  if (precision < 0 || !Number.isInteger(precision)) {
    throw new CssToolkitError('precision must be a non-negative integer', 'INVALID_CLAMP');
  }

  const unit = options.unit ?? 'rem';
  const minSizePx = options.minSize;
  const maxSizePx = options.maxSize;
  const minVw = options.minViewport;
  const maxVw = options.maxViewport;

  // Slope and Intercept
  const slope = (maxSizePx - minSizePx) / (maxVw - minVw);
  const intercept = -minVw * slope + minSizePx;

  const round = (val: number): number => {
    const factor = Math.pow(10, precision);
    return Math.round(val * factor) / factor;
  };

  let minStr: string;
  let maxStr: string;
  let preferredStr: string;

  if (unit === 'rem') {
    const minRem = round(minSizePx / rootFontSize);
    const maxRem = round(maxSizePx / rootFontSize);
    const interceptRem = round(intercept / rootFontSize);
    const slopeVw = round(slope * 100);

    minStr = `${minRem}rem`;
    maxStr = `${maxRem}rem`;

    const sign = interceptRem >= 0 ? '+' : '-';
    const absIntercept = Math.abs(interceptRem);
    preferredStr = `calc(${absIntercept}rem ${sign} ${Math.abs(slopeVw)}vw)`;
    if (interceptRem < 0) {
      preferredStr = `calc(-${absIntercept}rem + ${slopeVw}vw)`;
    }
  } else {
    const minPx = round(minSizePx);
    const maxPx = round(maxSizePx);
    const interceptPx = round(intercept);
    const slopeVw = round(slope * 100);

    minStr = `${minPx}px`;
    maxStr = `${maxPx}px`;

    const sign = interceptPx >= 0 ? '+' : '-';
    const absIntercept = Math.abs(interceptPx);
    preferredStr = `calc(${absIntercept}px ${sign} ${Math.abs(slopeVw)}vw)`;
    if (interceptPx < 0) {
      preferredStr = `calc(-${absIntercept}px + ${slopeVw}vw)`;
    }
  }

  // Handle case where minSize > maxSize (inverted slope)
  const [lowerBound, upperBound] = minSizePx <= maxSizePx ? [minStr, maxStr] : [maxStr, minStr];
  const clamp = `clamp(${lowerBound}, ${preferredStr}, ${upperBound})`;

  const evaluateAt = (vw: number): number => {
    const calculatedPx = slope * vw + intercept;
    const clampedPx = minSizePx <= maxSizePx
      ? Math.min(Math.max(calculatedPx, minSizePx), maxSizePx)
      : Math.min(Math.max(calculatedPx, maxSizePx), minSizePx);
    return round(unit === 'rem' ? clampedPx / rootFontSize : clampedPx);
  };

  return {
    clamp,
    css: `font-size: ${clamp};`,
    min: lowerBound,
    preferred: preferredStr,
    max: upperBound,
    slope: round(slope),
    intercept: round(intercept),
    evaluateAt,
  };
}
