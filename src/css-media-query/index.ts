import { formatDimension, assertSafeCss } from '../internal/validation/index.js';
import { formatDeclarations } from '../internal/css-serializer/index.js';
import { CssToolkitError } from '../internal/errors/index.js';

export type BreakpointPreset = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const MEDIA_BREAKPOINTS: Record<BreakpointPreset, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export interface MediaQueryOptions {
  preset?: BreakpointPreset;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  orientation?: 'portrait' | 'landscape';
  mediaType?: 'all' | 'screen' | 'print';
  prefersReducedMotion?: 'reduce' | 'no-preference';
  selector?: string;
  declarations?: Record<string, string | number>;
  rawCss?: string;
}

export interface MediaQueryResult {
  mediaQuery: string;
  css: string;
  condition: string;
}

export function generateMediaQuery(options: MediaQueryOptions): MediaQueryResult {
  const mediaType = options.mediaType ?? 'all';
  const conditions: string[] = [];

  if (options.preset) {
    const bp = MEDIA_BREAKPOINTS[options.preset];
    if (!bp) {
      throw new CssToolkitError(`Unknown breakpoint preset: "${options.preset}"`, 'INVALID_PROPERTY');
    }
    conditions.push(`(min-width: ${bp})`);
  }

  if (options.minWidth !== undefined) {
    conditions.push(`(min-width: ${formatDimension(options.minWidth)})`);
  }
  if (options.maxWidth !== undefined) {
    conditions.push(`(max-width: ${formatDimension(options.maxWidth)})`);
  }
  if (options.minHeight !== undefined) {
    conditions.push(`(min-height: ${formatDimension(options.minHeight)})`);
  }
  if (options.maxHeight !== undefined) {
    conditions.push(`(max-height: ${formatDimension(options.maxHeight)})`);
  }
  if (options.orientation) {
    conditions.push(`(orientation: ${options.orientation})`);
  }
  if (options.prefersReducedMotion) {
    conditions.push(`(prefers-reduced-motion: ${options.prefersReducedMotion})`);
  }

  if (conditions.length === 0 && mediaType === 'all') {
    throw new CssToolkitError('Media query requires at least one condition or media type', 'INVALID_PROPERTY');
  }

  let mediaHeader = '@media ';
  if (mediaType !== 'all') {
    mediaHeader += mediaType;
    if (conditions.length > 0) {
      mediaHeader += ` and ${conditions.join(' and ')}`;
    }
  } else {
    mediaHeader += conditions.join(' and ');
  }

  let body = '';
  if (options.rawCss) {
    assertSafeCss(options.rawCss);
    body = options.rawCss
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n');
  } else if (options.selector && options.declarations) {
    const decls = formatDeclarations(options.declarations, '    ');
    body = `  ${options.selector} {\n${decls}\n  }`;
  }

  const css = body ? `${mediaHeader} {\n${body}\n}` : `${mediaHeader} {}`;

  return {
    mediaQuery: mediaHeader,
    css,
    condition: conditions.join(' and '),
  };
}
