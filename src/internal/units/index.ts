import { CssToolkitError } from '../errors/index.js';

export type SupportedUnit = 'px' | 'rem' | 'em' | '%' | 'vw' | 'vh' | 'vmin' | 'vmax';

export interface UnitConversionContext {
  rootFontSize?: number; // e.g. 16
  parentFontSize?: number; // for em
  referenceDimension?: number; // for % (e.g. width or height in px)
  viewportWidth?: number; // for vw/vmin/vmax
  viewportHeight?: number; // for vh/vmin/vmax
  precision?: number;
}

const SUPPORTED_UNITS: Set<string> = new Set(['px', 'rem', 'em', '%', 'vw', 'vh', 'vmin', 'vmax']);

export function convertUnitInternal(
  value: number,
  fromUnit: SupportedUnit,
  toUnit: SupportedUnit,
  context?: UnitConversionContext
): number {
  if (!Number.isFinite(value)) {
    throw new CssToolkitError(`Value must be a finite number: ${value}`, 'INVALID_UNIT');
  }

  if (!SUPPORTED_UNITS.has(fromUnit)) {
    throw new CssToolkitError(`Unsupported source unit: "${fromUnit}"`, 'INVALID_UNIT');
  }

  if (!SUPPORTED_UNITS.has(toUnit)) {
    throw new CssToolkitError(`Unsupported target unit: "${toUnit}"`, 'INVALID_UNIT');
  }

  if (fromUnit === toUnit) {
    return value;
  }

  const rootFontSize = context?.rootFontSize ?? 16;
  const parentFontSize = context?.parentFontSize;
  const refDim = context?.referenceDimension;
  const vw = context?.viewportWidth;
  const vh = context?.viewportHeight;

  if (rootFontSize <= 0) {
    throw new CssToolkitError('rootFontSize must be a positive number', 'INVALID_UNIT');
  }

  // Convert fromUnit to base PX
  let pxValue = 0;
  switch (fromUnit) {
    case 'px':
      pxValue = value;
      break;
    case 'rem':
      pxValue = value * rootFontSize;
      break;
    case 'em':
      if (parentFontSize === undefined || parentFontSize <= 0) {
        throw new CssToolkitError('parentFontSize (> 0) is required for em conversion', 'MISSING_CONTEXT');
      }
      pxValue = value * parentFontSize;
      break;
    case '%':
      if (refDim === undefined || refDim <= 0) {
        throw new CssToolkitError('referenceDimension (> 0) is required for percentage conversion', 'MISSING_CONTEXT');
      }
      pxValue = (value / 100) * refDim;
      break;
    case 'vw':
      if (vw === undefined || vw <= 0) {
        throw new CssToolkitError('viewportWidth (> 0) is required for vw conversion', 'MISSING_CONTEXT');
      }
      pxValue = (value / 100) * vw;
      break;
    case 'vh':
      if (vh === undefined || vh <= 0) {
        throw new CssToolkitError('viewportHeight (> 0) is required for vh conversion', 'MISSING_CONTEXT');
      }
      pxValue = (value / 100) * vh;
      break;
    case 'vmin':
      if (vw === undefined || vh === undefined || vw <= 0 || vh <= 0) {
        throw new CssToolkitError('viewportWidth and viewportHeight (> 0) are required for vmin conversion', 'MISSING_CONTEXT');
      }
      pxValue = (value / 100) * Math.min(vw, vh);
      break;
    case 'vmax':
      if (vw === undefined || vh === undefined || vw <= 0 || vh <= 0) {
        throw new CssToolkitError('viewportWidth and viewportHeight (> 0) are required for vmax conversion', 'MISSING_CONTEXT');
      }
      pxValue = (value / 100) * Math.max(vw, vh);
      break;
  }

  // Convert base PX to toUnit
  let result = 0;
  switch (toUnit) {
    case 'px':
      result = pxValue;
      break;
    case 'rem':
      result = pxValue / rootFontSize;
      break;
    case 'em':
      if (parentFontSize === undefined || parentFontSize <= 0) {
        throw new CssToolkitError('parentFontSize (> 0) is required for em conversion', 'MISSING_CONTEXT');
      }
      result = pxValue / parentFontSize;
      break;
    case '%':
      if (refDim === undefined || refDim <= 0) {
        throw new CssToolkitError('referenceDimension (> 0) is required for percentage conversion', 'MISSING_CONTEXT');
      }
      result = (pxValue / refDim) * 100;
      break;
    case 'vw':
      if (vw === undefined || vw <= 0) {
        throw new CssToolkitError('viewportWidth (> 0) is required for vw conversion', 'MISSING_CONTEXT');
      }
      result = (pxValue / vw) * 100;
      break;
    case 'vh':
      if (vh === undefined || vh <= 0) {
        throw new CssToolkitError('viewportHeight (> 0) is required for vh conversion', 'MISSING_CONTEXT');
      }
      result = (pxValue / vh) * 100;
      break;
    case 'vmin':
      if (vw === undefined || vh === undefined || vw <= 0 || vh <= 0) {
        throw new CssToolkitError('viewportWidth and viewportHeight (> 0) are required for vmin conversion', 'MISSING_CONTEXT');
      }
      result = (pxValue / Math.min(vw, vh)) * 100;
      break;
    case 'vmax':
      if (vw === undefined || vh === undefined || vw <= 0 || vh <= 0) {
        throw new CssToolkitError('viewportWidth and viewportHeight (> 0) are required for vmax conversion', 'MISSING_CONTEXT');
      }
      result = (pxValue / Math.max(vw, vh)) * 100;
      break;
  }

  const precision = context?.precision;
  if (precision !== undefined) {
    if (precision < 0 || !Number.isInteger(precision)) {
      throw new CssToolkitError('precision must be a non-negative integer', 'INVALID_UNIT');
    }
    const factor = Math.pow(10, precision);
    return Math.round(result * factor) / factor;
  }

  return Math.round(result * 10000) / 10000;
}
