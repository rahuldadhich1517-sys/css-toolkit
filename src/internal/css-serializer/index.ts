import { assertSafeCss } from '../validation/index.js';

export function formatDeclarations(
  declarations: Record<string, string | number>,
  indent = '  '
): string {
  const entries = Object.entries(declarations);
  if (entries.length === 0) return '';

  return entries
    .map(([prop, val]) => {
      const cssProp = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      const cssVal = String(val);
      assertSafeCss(cssVal);
      return `${indent}${cssProp}: ${cssVal};`;
    })
    .join('\n');
}

export function formatRule(
  selector: string,
  declarations: Record<string, string | number>,
  indent = '  '
): string {
  assertSafeCss(selector);
  const declsFormatted = formatDeclarations(declarations, indent);
  if (!declsFormatted) {
    return `${selector} {}`;
  }
  return `${selector} {\n${declsFormatted}\n}`;
}
