import type { Container, Node, Comment, Declaration, Rule, AtRule } from 'postcss';
import { parseCssSafely } from '../internal/css-parser/index.js';

export interface BeautifyCssOptions {
  indent?: string | number;
  preserveComments?: boolean;
  lineEnding?: '\n' | '\r\n';
}

function getIndentString(indentOption: string | number | undefined): string {
  if (typeof indentOption === 'number') {
    return ' '.repeat(Math.max(0, indentOption));
  }
  return indentOption ?? '  ';
}

export function beautifyCss(css: string, options?: BeautifyCssOptions): string {
  const root = parseCssSafely(css);
  const indentStr = getIndentString(options?.indent);
  const lineEnding = options?.lineEnding ?? '\n';
  const preserveComments = options?.preserveComments ?? true;

  function stringifyNode(node: Node, depth: number): string {
    const currentIndent = indentStr.repeat(depth);

    switch (node.type) {
      case 'comment': {
        if (!preserveComments) return '';
        const comment = node as Comment;
        return `${currentIndent}/* ${comment.text.trim()} */`;
      }

      case 'decl': {
        const decl = node as Declaration;
        const important = decl.important ? ' !important' : '';
        return `${currentIndent}${decl.prop}: ${decl.value}${important};`;
      }

      case 'rule': {
        const rule = node as Rule;
        const selectorLines = rule.selectors && rule.selectors.length > 1
          ? rule.selectors.map((s: string) => `${currentIndent}${s}`).join(`,${lineEnding}`)
          : `${currentIndent}${rule.selector}`;

        const innerContent = stringifyContainer(rule, depth + 1);
        if (!innerContent) {
          return `${selectorLines} {}`;
        }
        return `${selectorLines} {${lineEnding}${innerContent}${lineEnding}${currentIndent}}`;
      }

      case 'atrule': {
        const atRule = node as AtRule;
        const params = atRule.params ? ` ${atRule.params}` : '';
        const atRuleHeader = `${currentIndent}@${atRule.name}${params}`;

        if (!atRule.nodes) {
          return `${atRuleHeader};`;
        }

        const innerContent = stringifyContainer(atRule, depth + 1);
        if (!innerContent) {
          return `${atRuleHeader} {}`;
        }
        return `${atRuleHeader} {${lineEnding}${innerContent}${lineEnding}${currentIndent}}`;
      }

      default:
        return '';
    }
  }

  function stringifyContainer(container: Container, depth: number): string {
    const lines: string[] = [];
    if (!container.nodes) return '';

    for (const child of container.nodes) {
      const rendered = stringifyNode(child, depth);
      if (rendered) {
        lines.push(rendered);
      }
    }
    return lines.join(lineEnding);
  }

  const result = stringifyContainer(root, 0);
  return result ? `${result}${lineEnding}` : '';
}
