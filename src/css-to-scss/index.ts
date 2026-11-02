import type { Container, Rule } from 'postcss';
import { parseCssSafely } from '../internal/css-parser/index.js';

export interface CssToScssOptions {
  indent?: string;
  nestModifiers?: boolean;
}

export function cssToScss(css: string, options?: CssToScssOptions): string {
  const root = parseCssSafely(css);
  const indent = options?.indent ?? '  ';
  const nestModifiers = options?.nestModifiers ?? true;

  function formatDecls(rule: Rule, depth: number): string[] {
    const curIndent = indent.repeat(depth);
    const declLines: string[] = [];
    rule.walkDecls((decl) => {
      declLines.push(`${curIndent}${decl.prop}: ${decl.value};`);
    });
    return declLines;
  }

  // We can collect rules and see if we can nest them into parent containers
  const processedRules = new Set<Rule>();

  function processContainer(container: Container, depth: number): string[] {
    const output: string[] = [];
    const children = container.nodes ?? [];

    for (let i = 0; i < children.length; i++) {
      const node = children[i]!;

      if (node.type === 'comment') {
        output.push(`${indent.repeat(depth)}/* ${node.text.trim()} */`);
        continue;
      }

      if (node.type === 'atrule') {
        const atRuleHeader = `${indent.repeat(depth)}@${node.name}${node.params ? ` ${node.params}` : ''}`;
        if (!node.nodes) {
          output.push(`${atRuleHeader};`);
        } else {
          const inner = processContainer(node, depth + 1);
          output.push(`${atRuleHeader} {\n${inner.join('\n')}\n${indent.repeat(depth)}}`);
        }
        continue;
      }

      if (node.type === 'rule' && !processedRules.has(node)) {
        const baseSelector = node.selector.trim();
        const ruleDecls = formatDecls(node, depth + 1);

        // Look ahead for matching child rules or pseudo-classes:
        // e.g. baseSelector = ".button", target = ".button:hover" or ".button .icon"
        const nestedRules: string[] = [];

        if (nestModifiers) {
          for (let j = i + 1; j < children.length; j++) {
            const nextNode = children[j]!;
            if (nextNode.type === 'rule' && !processedRules.has(nextNode)) {
              const nextSel = nextNode.selector.trim();

              // Check for pseudo-class / modifier: .button:hover -> &:hover, .button.active -> &.active
              if (nextSel.startsWith(`${baseSelector}:`) || nextSel.startsWith(`${baseSelector}.`) || nextSel.startsWith(`${baseSelector}--`)) {
                const subSel = nextSel.slice(baseSelector.length);
                const subDecls = formatDecls(nextNode, depth + 2);
                nestedRules.push(`${indent.repeat(depth + 1)}&${subSel} {\n${subDecls.join('\n')}\n${indent.repeat(depth + 1)}}`);
                processedRules.add(nextNode);
              }
              // Check for descendant: .button .icon -> .icon
              else if (nextSel.startsWith(`${baseSelector} `)) {
                const subSel = nextSel.slice(baseSelector.length + 1);
                const subDecls = formatDecls(nextNode, depth + 2);
                nestedRules.push(`${indent.repeat(depth + 1)}${subSel} {\n${subDecls.join('\n')}\n${indent.repeat(depth + 1)}}`);
                processedRules.add(nextNode);
              }
            }
          }
        }

        processedRules.add(node);

        const allBody = [...ruleDecls, ...nestedRules];
        if (allBody.length === 0) {
          output.push(`${indent.repeat(depth)}${baseSelector} {}`);
        } else {
          output.push(`${indent.repeat(depth)}${baseSelector} {\n${allBody.join('\n')}\n${indent.repeat(depth)}}`);
        }
      }
    }

    return output;
  }

  const resultLines = processContainer(root, 0);
  return resultLines.join('\n\n');
}
