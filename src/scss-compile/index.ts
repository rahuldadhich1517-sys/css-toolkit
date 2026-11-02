import * as sass from 'sass';
import { CssToolkitError } from '../internal/errors/index.js';
import { assertSafeCss } from '../internal/validation/index.js';

export interface CompileScssOptions {
  style?: 'expanded' | 'compressed';
  loadPaths?: string[];
  sourceMap?: boolean;
}

export interface CompileScssResult {
  css: string;
  sourceMap?: any;
}

export function compileScss(source: string, options?: CompileScssOptions): CompileScssResult {
  if (typeof source !== 'string') {
    throw new CssToolkitError(`SCSS source must be a string, received ${typeof source}`, 'SCSS_COMPILATION_ERROR');
  }

  assertSafeCss(source);

  try {
    const result = sass.compileString(source, {
      style: options?.style ?? 'expanded',
      loadPaths: options?.loadPaths,
      sourceMap: options?.sourceMap ?? false,
    });

    return {
      css: result.css,
      sourceMap: result.sourceMap,
    };
  } catch (err: any) {
    const loc = err.span ? { line: err.span.start.line + 1, column: err.span.start.column + 1 } : undefined;
    throw new CssToolkitError(`SCSS compilation failed: ${err.message}`, 'SCSS_COMPILATION_ERROR', loc);
  }
}
