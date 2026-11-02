import { CssToolkitError } from '../internal/errors/index.js';
import { assertSafeCss } from '../internal/validation/index.js';
import { formatDeclarations } from '../internal/css-serializer/index.js';

export interface CssRuleInput {
  selector: string | string[];
  declarations: Record<string, string | number>;
  media?: string;
  pseudo?: string;
  comment?: string;
}

export interface GenerateCssOptions {
  indent?: string;
  comment?: string;
}

export function generateCss(
  input: CssRuleInput | CssRuleInput[],
  options?: GenerateCssOptions
): string {
  const rules = Array.isArray(input) ? input : [input];
  if (rules.length === 0) {
    return '';
  }

  const indent = options?.indent ?? '  ';
  const lines: string[] = [];

  if (options?.comment) {
    assertSafeCss(options.comment);
    lines.push(`/* ${options.comment.replace(/\*\//g, '* /')} */`);
  }

  // Group rules by media query (undefined for root rules)
  const mediaGroups = new Map<string | undefined, CssRuleInput[]>();
  for (const rule of rules) {
    if (!rule.selector || (Array.isArray(rule.selector) && rule.selector.length === 0)) {
      throw new CssToolkitError('Each CSS rule must specify a valid selector', 'INVALID_CSS');
    }
    if (!rule.declarations || typeof rule.declarations !== 'object') {
      throw new CssToolkitError('Each CSS rule must have a declarations object', 'INVALID_CSS');
    }
    const media = rule.media?.trim() || undefined;
    if (media) {
      assertSafeCss(media);
    }
    const group = mediaGroups.get(media) ?? [];
    group.push(rule);
    mediaGroups.set(media, group);
  }

  function renderRule(rule: CssRuleInput, ruleIndent: string): string {
    const rawSelectors = Array.isArray(rule.selector) ? rule.selector : [rule.selector];
    const selectors = rawSelectors.map((s) => {
      const trimmed = s.trim();
      if (!trimmed) {
        throw new CssToolkitError('Selector cannot be empty', 'INVALID_CSS');
      }
      assertSafeCss(trimmed);
      return rule.pseudo ? `${trimmed}${rule.pseudo}` : trimmed;
    });

    const selectorLine = `${ruleIndent}${selectors.join(', ')}`;
    const declIndent = `${ruleIndent}${indent}`;
    const declsFormatted = formatDeclarations(rule.declarations, declIndent);

    const ruleLines: string[] = [];
    if (rule.comment) {
      assertSafeCss(rule.comment);
      ruleLines.push(`${ruleIndent}/* ${rule.comment.replace(/\*\//g, '* /')} */`);
    }

    if (!declsFormatted) {
      ruleLines.push(`${selectorLine} {}`);
    } else {
      ruleLines.push(`${selectorLine} {\n${declsFormatted}\n${ruleIndent}}`);
    }
    return ruleLines.join('\n');
  }

  // Render root rules first
  const rootRules = mediaGroups.get(undefined);
  if (rootRules) {
    for (const rule of rootRules) {
      lines.push(renderRule(rule, ''));
    }
  }

  // Render media query groups
  for (const [media, groupRules] of mediaGroups.entries()) {
    if (!media) continue;
    const innerRules = groupRules.map((r) => renderRule(r, indent)).join('\n\n');
    lines.push(`@media ${media} {\n${innerRules}\n}`);
  }

  return lines.join('\n\n');
}
