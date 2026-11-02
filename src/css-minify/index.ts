import type { Container, Node, Comment, Declaration, Rule, AtRule } from 'postcss';
import { parseCssSafely } from '../internal/css-parser/index.js';

export interface MinifyCssOptions {
  preserveLicenseComments?: boolean;
}

export function minifyCss(css: string, options?: MinifyCssOptions): string {
  const root = parseCssSafely(css);
  const preserveLicense = options?.preserveLicenseComments ?? true;

  function stringifyNode(node: Node): string {
    switch (node.type) {
      case 'comment': {
        const comment = node as Comment;
        if (preserveLicense && comment.text.startsWith('!')) {
          return `/*! ${comment.text.slice(1).trim()} */`;
        }
        return '';
      }

      case 'decl': {
        const decl = node as Declaration;
        const important = decl.important ? '!important' : '';
        const prop = decl.prop.trim();
        const value = decl.value.trim();
        return `${prop}:${value}${important ? ` ${important}` : ''};`;
      }

      case 'rule': {
        const rule = node as Rule;
        const selectors = (rule.selectors ?? [rule.selector])
          .map((s: string) => s.trim())
          .join(',');

        const inner = stringifyContainer(rule);
        if (!inner) return '';
        return `${selectors}{${inner}}`;
      }

      case 'atrule': {
        const atRule = node as AtRule;
        const params = atRule.params.trim();
        const header = params ? `@${atRule.name} ${params}` : `@${atRule.name}`;

        if (!atRule.nodes) {
          return `${header};`;
        }

        const inner = stringifyContainer(atRule);
        if (!inner) return '';
        return `${header}{${inner}}`;
      }

      default:
        return '';
    }
  }

  function stringifyContainer(container: Container): string {
    const parts: string[] = [];
    if (!container.nodes) return '';

    for (const child of container.nodes) {
      const rendered = stringifyNode(child);
      if (rendered) {
        parts.push(rendered);
      }
    }
    return parts.join('');
  }

  return stringifyContainer(root);
}
