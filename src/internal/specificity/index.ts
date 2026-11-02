import parser, { type Node, type Container, type Pseudo } from 'postcss-selector-parser';
import { CssToolkitError } from '../errors/index.js';
import { assertSafeCss } from '../validation/index.js';

export interface Specificity {
  inline: number;
  ids: number;
  classesAttributesPseudoClasses: number;
  elementsPseudoElements: number;
}

const PSEUDO_ELEMENTS = new Set([
  '::before',
  '::after',
  '::first-line',
  '::first-letter',
  '::selection',
  '::backdrop',
  '::placeholder',
  '::marker',
  ':before',
  ':after',
  ':first-line',
  ':first-letter',
]);

function addSpecificity(a: Specificity, b: Specificity): Specificity {
  return {
    inline: a.inline + b.inline,
    ids: a.ids + b.ids,
    classesAttributesPseudoClasses: a.classesAttributesPseudoClasses + b.classesAttributesPseudoClasses,
    elementsPseudoElements: a.elementsPseudoElements + b.elementsPseudoElements,
  };
}

function maxSpecificity(list: Specificity[]): Specificity {
  if (list.length === 0) {
    return { inline: 0, ids: 0, classesAttributesPseudoClasses: 0, elementsPseudoElements: 0 };
  }
  return list.reduce((max, curr) => (compareSpecificity(curr, max) > 0 ? curr : max), list[0]!);
}

function calculateNodeSpecificity(node: Node): Specificity {
  const zero: Specificity = { inline: 0, ids: 0, classesAttributesPseudoClasses: 0, elementsPseudoElements: 0 };

  switch (node.type) {
    case 'id':
      return { inline: 0, ids: 1, classesAttributesPseudoClasses: 0, elementsPseudoElements: 0 };

    case 'class':
    case 'attribute':
      return { inline: 0, ids: 0, classesAttributesPseudoClasses: 1, elementsPseudoElements: 0 };

    case 'tag':
      return { inline: 0, ids: 0, classesAttributesPseudoClasses: 0, elementsPseudoElements: 1 };

    case 'pseudo': {
      const pseudoNode = node as Pseudo;
      const name = pseudoNode.value.toLowerCase();

      // Check if it's a pseudo-element
      if (PSEUDO_ELEMENTS.has(name) || name.startsWith('::')) {
        return { inline: 0, ids: 0, classesAttributesPseudoClasses: 0, elementsPseudoElements: 1 };
      }

      // :where() has 0 specificity
      if (name === ':where') {
        return zero;
      }

      // :is(), :not(), :has() take the specificity of the most specific argument
      if (name === ':is' || name === ':not' || name === ':has') {
        if (!pseudoNode.nodes || pseudoNode.nodes.length === 0) return zero;
        const argSpecs = pseudoNode.nodes.map((arg) => calculateContainerSpecificity(arg as Container));
        return maxSpecificity(argSpecs);
      }

      // :nth-child() and :nth-last-child() with 'of <selector>'
      if (name === ':nth-child' || name === ':nth-last-child') {
        let base: Specificity = { inline: 0, ids: 0, classesAttributesPseudoClasses: 1, elementsPseudoElements: 0 };
        if (pseudoNode.nodes && pseudoNode.nodes.length > 0) {
          // Check if 'of' is present in the selector arguments
          const argSpecs = pseudoNode.nodes.map((arg) => calculateContainerSpecificity(arg as Container));
          base = addSpecificity(base, maxSpecificity(argSpecs));
        }
        return base;
      }

      // Standard pseudo-class (:hover, :focus, :first-child, etc.)
      return { inline: 0, ids: 0, classesAttributesPseudoClasses: 1, elementsPseudoElements: 0 };
    }

    case 'universal':
    case 'combinator':
    case 'comment':
    case 'string':
      return zero;

    default:
      if ('nodes' in node && Array.isArray((node as Container).nodes)) {
        return calculateContainerSpecificity(node as Container);
      }
      return zero;
  }
}

function calculateContainerSpecificity(container: Container): Specificity {
  let total: Specificity = { inline: 0, ids: 0, classesAttributesPseudoClasses: 0, elementsPseudoElements: 0 };
  if (!container.nodes) return total;

  for (const child of container.nodes) {
    total = addSpecificity(total, calculateNodeSpecificity(child));
  }
  return total;
}

export function calculateSpecificity(selector: string): Specificity {
  if (typeof selector !== 'string' || selector.trim() === '') {
    throw new CssToolkitError('Selector must be a non-empty string', 'INVALID_SELECTOR');
  }

  assertSafeCss(selector);

  try {
    const root = parser().astSync(selector);
    // If selector has multiple comma-separated selectors (root.nodes), return the maximum specificity
    const selectorSpecs = root.nodes.map((sel) => calculateContainerSpecificity(sel as Container));
    return maxSpecificity(selectorSpecs);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new CssToolkitError(`Failed to parse selector "${selector}": ${message}`, 'INVALID_SELECTOR');
  }
}

export function compareSpecificity(
  a: Specificity | string,
  b: Specificity | string
): number {
  const specA = typeof a === 'string' ? calculateSpecificity(a) : a;
  const specB = typeof b === 'string' ? calculateSpecificity(b) : b;

  if (specA.inline !== specB.inline) {
    return specA.inline > specB.inline ? 1 : -1;
  }
  if (specA.ids !== specB.ids) {
    return specA.ids > specB.ids ? 1 : -1;
  }
  if (specA.classesAttributesPseudoClasses !== specB.classesAttributesPseudoClasses) {
    return specA.classesAttributesPseudoClasses > specB.classesAttributesPseudoClasses ? 1 : -1;
  }
  if (specA.elementsPseudoElements !== specB.elementsPseudoElements) {
    return specA.elementsPseudoElements > specB.elementsPseudoElements ? 1 : -1;
  }
  return 0;
}
