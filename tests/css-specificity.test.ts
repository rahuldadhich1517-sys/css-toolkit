import { describe, it, expect } from 'vitest';
import {
  calculateSpecificity,
  compareSpecificity,
} from '../src/css-specificity/index.js';
import { CssToolkitError } from '../src/internal/errors/index.js';

describe('css-specificity', () => {
  it('calculates element, class, id, attribute, and pseudo selectors', () => {
    // Universal selector: (0, 0, 0, 0)
    expect(calculateSpecificity('*')).toEqual({
      inline: 0,
      ids: 0,
      classesAttributesPseudoClasses: 0,
      elementsPseudoElements: 0,
    });

    // Element: (0, 0, 0, 1)
    expect(calculateSpecificity('h1')).toEqual({
      inline: 0,
      ids: 0,
      classesAttributesPseudoClasses: 0,
      elementsPseudoElements: 1,
    });

    // Class: (0, 0, 1, 0)
    expect(calculateSpecificity('.btn')).toEqual({
      inline: 0,
      ids: 0,
      classesAttributesPseudoClasses: 1,
      elementsPseudoElements: 0,
    });

    // ID: (0, 1, 0, 0)
    expect(calculateSpecificity('#main')).toEqual({
      inline: 0,
      ids: 1,
      classesAttributesPseudoClasses: 0,
      elementsPseudoElements: 0,
    });

    // Attribute: (0, 0, 1, 0)
    expect(calculateSpecificity('[type="text"]')).toEqual({
      inline: 0,
      ids: 0,
      classesAttributesPseudoClasses: 1,
      elementsPseudoElements: 0,
    });

    // Pseudo-class :hover -> (0, 0, 1, 0)
    expect(calculateSpecificity('a:hover')).toEqual({
      inline: 0,
      ids: 0,
      classesAttributesPseudoClasses: 1,
      elementsPseudoElements: 1,
    });

    // Pseudo-element ::before / :before -> (0, 0, 0, 1)
    expect(calculateSpecificity('p::before')).toEqual({
      inline: 0,
      ids: 0,
      classesAttributesPseudoClasses: 0,
      elementsPseudoElements: 2,
    });

    // Compound selector: ul.nav > li#active.item a:hover
    // IDs: 1 (#active)
    // Classes/Attrs/Pseudos: .nav, .item, :hover = 3
    // Elements: ul, li, a = 3
    expect(calculateSpecificity('ul.nav > li#active.item a:hover')).toEqual({
      inline: 0,
      ids: 1,
      classesAttributesPseudoClasses: 3,
      elementsPseudoElements: 3,
    });
  });

  it('correctly handles modern pseudo-classes :is, :not, :has, and :where', () => {
    // :where() has 0 specificity regardless of contents
    expect(calculateSpecificity(':where(#id.class)')).toEqual({
      inline: 0,
      ids: 0,
      classesAttributesPseudoClasses: 0,
      elementsPseudoElements: 0,
    });

    // :is() takes the specificity of its most specific argument
    // :is(.class, #id) -> specificity of #id (0, 1, 0, 0)
    expect(calculateSpecificity(':is(.class, #id)')).toEqual({
      inline: 0,
      ids: 1,
      classesAttributesPseudoClasses: 0,
      elementsPseudoElements: 0,
    });

    // :not() takes the specificity of its most specific argument
    expect(calculateSpecificity('p:not(.highlight)')).toEqual({
      inline: 0,
      ids: 0,
      classesAttributesPseudoClasses: 1,
      elementsPseudoElements: 1,
    });

    // :has() takes the specificity of its most specific argument
    expect(calculateSpecificity('div:has(#logo)')).toEqual({
      inline: 0,
      ids: 1,
      classesAttributesPseudoClasses: 0,
      elementsPseudoElements: 1,
    });
  });

  it('compares specificity accurately', () => {
    // ID beats multiple classes
    expect(compareSpecificity('#header', '.menu.active.open')).toBe(1);
    expect(compareSpecificity('.menu.active', '#header')).toBe(-1);
    expect(compareSpecificity('.item', '.item')).toBe(0);
    expect(compareSpecificity('div p', 'p')).toBe(1);
  });

  it('throws on invalid selector', () => {
    expect(() => calculateSpecificity('')).toThrow(CssToolkitError);
  });
});
