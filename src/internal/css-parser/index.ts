import postcss, { type Root, type CssSyntaxError } from 'postcss';
import { CssToolkitError } from '../errors/index.js';
import { assertSafeCss } from '../validation/index.js';

export function parseCssSafely(css: string): Root {
  if (typeof css !== 'string') {
    throw new CssToolkitError(`CSS input must be a string, received ${typeof css}`, 'INVALID_CSS');
  }
  assertSafeCss(css);

  try {
    return postcss.parse(css, { from: undefined });
  } catch (err) {
    const error = err as CssSyntaxError;
    const location = error.line !== undefined ? { line: error.line, column: error.column } : undefined;
    throw new CssToolkitError(`CSS parsing error: ${error.reason ?? error.message}`, 'INVALID_CSS', location);
  }
}
