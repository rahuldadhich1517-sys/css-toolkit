import { formatDimension, assertSafeCss } from '../internal/validation/index.js';
import { formatDeclarations } from '../internal/css-serializer/index.js';
import { CssToolkitError } from '../internal/errors/index.js';

export type GridAutoFlow = 'row' | 'column' | 'dense' | 'row dense' | 'column dense';

export interface GridOptions {
  inline?: boolean;
  columns?: number | string | string[];
  rows?: number | string | string[];
  areas?: string[];
  autoColumns?: string;
  autoRows?: string;
  autoFlow?: GridAutoFlow;
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
  alignItems?: string;
  justifyItems?: string;
  alignContent?: string;
  justifyContent?: string;
  selector?: string;
}

export interface GridResult {
  declarations: Record<string, string>;
  css: string;
}

function formatTracks(tracks: number | string | string[]): string {
  if (typeof tracks === 'number') {
    if (!Number.isInteger(tracks) || tracks <= 0) {
      throw new CssToolkitError(`Grid tracks count must be a positive integer: ${tracks}`, 'INVALID_GRID');
    }
    return `repeat(${tracks}, 1fr)`;
  }
  if (Array.isArray(tracks)) {
    if (tracks.length === 0) {
      throw new CssToolkitError('Grid tracks array cannot be empty', 'INVALID_GRID');
    }
    return tracks.map((t) => formatDimension(t)).join(' ');
  }
  if (typeof tracks === 'string') {
    const trimmed = tracks.trim();
    if (!trimmed) {
      throw new CssToolkitError('Grid tracks string cannot be empty', 'INVALID_GRID');
    }
    assertSafeCss(trimmed);
    return trimmed;
  }
  throw new CssToolkitError('Invalid grid tracks specification', 'INVALID_GRID');
}

export function generateGrid(options?: GridOptions): GridResult {
  const decls: Record<string, string> = {
    display: options?.inline ? 'inline-grid' : 'grid',
  };

  if (options?.columns !== undefined) {
    decls['grid-template-columns'] = formatTracks(options.columns);
  }

  if (options?.rows !== undefined) {
    decls['grid-template-rows'] = formatTracks(options.rows);
  }

  if (options?.areas && options.areas.length > 0) {
    const areasStr = options.areas
      .map((row) => {
        assertSafeCss(row);
        return `"${row.trim()}"`;
      })
      .join(' ');
    decls['grid-template-areas'] = areasStr;
  }

  if (options?.autoColumns) {
    assertSafeCss(options.autoColumns);
    decls['grid-auto-columns'] = options.autoColumns;
  }

  if (options?.autoRows) {
    assertSafeCss(options.autoRows);
    decls['grid-auto-rows'] = options.autoRows;
  }

  if (options?.autoFlow) {
    decls['grid-auto-flow'] = options.autoFlow;
  }

  if (options?.gap !== undefined) decls['gap'] = formatDimension(options.gap);
  if (options?.rowGap !== undefined) decls['row-gap'] = formatDimension(options.rowGap);
  if (options?.columnGap !== undefined) decls['column-gap'] = formatDimension(options.columnGap);

  if (options?.alignItems) decls['align-items'] = options.alignItems;
  if (options?.justifyItems) decls['justify-items'] = options.justifyItems;
  if (options?.alignContent) decls['align-content'] = options.alignContent;
  if (options?.justifyContent) decls['justify-content'] = options.justifyContent;

  const sel = options?.selector;
  const declsFormatted = formatDeclarations(decls, sel ? '  ' : '');
  const css = sel ? `${sel} {\n${declsFormatted}\n}` : Object.entries(decls).map(([k, v]) => `${k}: ${v};`).join('\n');

  return {
    declarations: decls,
    css,
  };
}
