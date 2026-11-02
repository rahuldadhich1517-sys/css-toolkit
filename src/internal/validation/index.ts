import { CssToolkitError } from '../errors/index.js';

const IDENTIFIER_REGEX = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;
const UNSAFE_CONTENT_REGEX = /<script\b|javascript:|expression\(|vbscript:|behavior:/i;

export function validateIdentifier(id: string, fieldName = 'identifier'): void {
  if (typeof id !== 'string' || id.trim() === '') {
    throw new CssToolkitError(`${fieldName} must be a non-empty string`, 'INVALID_PROPERTY');
  }
  if (!IDENTIFIER_REGEX.test(id)) {
    throw new CssToolkitError(`Invalid ${fieldName}: "${id}". Must be a valid CSS identifier.`, 'INVALID_PROPERTY');
  }
}

export function assertSafeCss(css: string): void {
  if (UNSAFE_CONTENT_REGEX.test(css)) {
    throw new CssToolkitError('Potentially unsafe content detected in CSS input', 'SECURITY_ERROR');
  }
}

export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === 'number' && Number.isFinite(val);
}

export function validateNumber(
  val: unknown,
  fieldName: string,
  min?: number,
  max?: number
): asserts val is number {
  if (!isFiniteNumber(val)) {
    throw new CssToolkitError(`${fieldName} must be a finite number, received ${String(val)}`, 'INVALID_PROPERTY');
  }
  if (min !== undefined && val < min) {
    throw new CssToolkitError(`${fieldName} (${val}) cannot be less than ${min}`, 'INVALID_PROPERTY');
  }
  if (max !== undefined && val > max) {
    throw new CssToolkitError(`${fieldName} (${val}) cannot be greater than ${max}`, 'INVALID_PROPERTY');
  }
}

export function formatDimension(val: number | string, defaultUnit = 'px'): string {
  if (typeof val === 'number') {
    if (!Number.isFinite(val)) {
      throw new CssToolkitError(`Invalid numeric value: ${val}`, 'INVALID_UNIT');
    }
    return val === 0 ? '0' : `${val}${defaultUnit}`;
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) {
      throw new CssToolkitError('Dimension string cannot be empty', 'INVALID_UNIT');
    }
    assertSafeCss(trimmed);
    return trimmed;
  }
  throw new CssToolkitError(`Dimension must be number or string, received ${typeof val}`, 'INVALID_UNIT');
}
