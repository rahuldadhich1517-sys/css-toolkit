import * as cheerio from 'cheerio';
import { CssToolkitError } from '../internal/errors/index.js';
import { assertSafeCss } from '../internal/validation/index.js';

export interface MatchedElementSummary {
  tag: string;
  id?: string;
  classList: string[];
  attributes: Record<string, string>;
  text: string;
}

export interface SelectorTestResult {
  matches: boolean;
  count: number;
  elements: MatchedElementSummary[];
  selector: string;
}

export interface SelectorTestOptions {
  limit?: number;
}

export function testCssSelector(
  selector: string,
  html: string,
  options?: SelectorTestOptions
): SelectorTestResult {
  if (typeof selector !== 'string' || selector.trim() === '') {
    throw new CssToolkitError('Selector must be a non-empty string', 'INVALID_SELECTOR');
  }
  if (typeof html !== 'string') {
    throw new CssToolkitError('HTML must be a string', 'INVALID_PROPERTY');
  }

  assertSafeCss(selector);

  const $ = cheerio.load(html);
  let matchedNodes: cheerio.Cheerio<any>;

  try {
    matchedNodes = $(selector);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new CssToolkitError(`Invalid or unsupported CSS selector: "${selector}" (${msg})`, 'INVALID_SELECTOR');
  }

  const count = matchedNodes.length;
  const limit = options?.limit ?? 50;
  const elements: MatchedElementSummary[] = [];

  matchedNodes.slice(0, limit).each((_, el) => {
    if (el.type === 'tag') {
      const attribs = el.attribs ?? {};
      const id = attribs.id;
      const classList = attribs.class ? attribs.class.trim().split(/\s+/) : [];
      const text = $(el).text().trim().slice(0, 100);

      elements.push({
        tag: el.tagName,
        id,
        classList,
        attributes: attribs,
        text,
      });
    }
  });

  return {
    matches: count > 0,
    count,
    elements,
    selector,
  };
}
