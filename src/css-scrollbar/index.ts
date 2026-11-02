import { formatDimension } from '../internal/validation/index.js';
import { parseColor, convertColor } from '../internal/color/parser.js';

export interface ScrollbarOptions {
  width?: number | string;
  trackColor?: string;
  thumbColor?: string;
  thumbRadius?: number | string;
  hoverColor?: string;
  border?: string;
  selector?: string;
}

export interface ScrollbarResult {
  standardCss: string;
  webkitCss: string;
  css: string;
}

export function generateScrollbar(options?: ScrollbarOptions): ScrollbarResult {
  const width = options?.width !== undefined ? formatDimension(options.width) : '8px';
  const trackRaw = options?.trackColor ?? '#f1f1f1';
  const thumbRaw = options?.thumbColor ?? '#888888';
  const hoverRaw = options?.hoverColor ?? '#555555';

  const trackColor = convertColor(parseColor(trackRaw).rgb);
  const thumbColor = convertColor(parseColor(thumbRaw).rgb);
  const hoverColor = convertColor(parseColor(hoverRaw).rgb);

  const sel = options?.selector ?? '';
  const prefix = sel ? `${sel}` : '';

  // Standard CSS (Firefox / modern browsers)
  const standardWidth = typeof options?.width === 'number' && options.width <= 8 ? 'thin' : 'auto';
  const standardLines: string[] = [
    `scrollbar-width: ${standardWidth};`,
    `scrollbar-color: ${thumbColor} ${trackColor};`,
  ];
  const standardCss = sel
    ? `${prefix} {\n  ${standardLines.join('\n  ')}\n}`
    : standardLines.join('\n');

  // WebKit pseudo-elements
  const thumbRadius = options?.thumbRadius !== undefined ? formatDimension(options.thumbRadius) : undefined;
  const webkitBlocks: string[] = [
    `${prefix}::-webkit-scrollbar {
  width: ${width};
  height: ${width};
}`,
    `${prefix}::-webkit-scrollbar-track {
  background: ${trackColor};
}`,
    `${prefix}::-webkit-scrollbar-thumb {
  background: ${thumbColor};${thumbRadius ? `\n  border-radius: ${thumbRadius};` : ''}${options?.border ? `\n  border: ${options.border};` : ''}
}`,
    `${prefix}::-webkit-scrollbar-thumb:hover {
  background: ${hoverColor};
}`,
  ];

  const webkitCss = webkitBlocks.join('\n\n');
  const fullCss = `${standardCss}\n\n${webkitCss}`;

  return {
    standardCss,
    webkitCss,
    css: fullCss,
  };
}
