import { formatDimension } from '../internal/validation/index.js';
import { formatDeclarations } from '../internal/css-serializer/index.js';
import { CssToolkitError } from '../internal/errors/index.js';

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'start'
  | 'end';
export type AlignItems = 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'start' | 'end';
export type AlignContent =
  | 'stretch'
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'start'
  | 'end';
export type AlignSelf = 'auto' | 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'start' | 'end';

export type FlexPreset = 'center' | 'stack' | 'row' | 'spaceBetween';

export interface FlexboxOptions {
  preset?: FlexPreset;
  inline?: boolean;
  direction?: FlexDirection;
  wrap?: FlexWrap;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  alignContent?: AlignContent;
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
  alignSelf?: AlignSelf;
  order?: number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number | string;
  selector?: string;
}

export interface FlexboxResult {
  declarations: Record<string, string>;
  css: string;
}

const PRESETS: Record<FlexPreset, Partial<FlexboxOptions>> = {
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stack: {
    direction: 'column',
  },
  row: {
    direction: 'row',
  },
  spaceBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

export function generateFlexbox(options?: FlexboxOptions): FlexboxResult {
  const merged: FlexboxOptions = {
    ...(options?.preset ? PRESETS[options.preset] : {}),
    ...options,
  };

  const decls: Record<string, string> = {
    display: merged.inline ? 'inline-flex' : 'flex',
  };

  if (merged.direction) decls['flex-direction'] = merged.direction;
  if (merged.wrap) decls['flex-wrap'] = merged.wrap;
  if (merged.justifyContent) decls['justify-content'] = merged.justifyContent;
  if (merged.alignItems) decls['align-items'] = merged.alignItems;
  if (merged.alignContent) decls['align-content'] = merged.alignContent;

  if (merged.gap !== undefined) decls['gap'] = formatDimension(merged.gap);
  if (merged.rowGap !== undefined) decls['row-gap'] = formatDimension(merged.rowGap);
  if (merged.columnGap !== undefined) decls['column-gap'] = formatDimension(merged.columnGap);

  if (merged.alignSelf) decls['align-self'] = merged.alignSelf;
  if (merged.order !== undefined) {
    if (!Number.isInteger(merged.order)) {
      throw new CssToolkitError('order must be an integer', 'INVALID_PROPERTY');
    }
    decls['order'] = String(merged.order);
  }
  if (merged.flexGrow !== undefined) decls['flex-grow'] = String(merged.flexGrow);
  if (merged.flexShrink !== undefined) decls['flex-shrink'] = String(merged.flexShrink);
  if (merged.flexBasis !== undefined) decls['flex-basis'] = formatDimension(merged.flexBasis);

  const sel = merged.selector;
  const declsFormatted = formatDeclarations(decls, sel ? '  ' : '');
  const css = sel ? `${sel} {\n${declsFormatted}\n}` : Object.entries(decls).map(([k, v]) => `${k}: ${v};`).join('\n');

  return {
    declarations: decls,
    css,
  };
}
