import { formatDimension, validateNumber, validateIdentifier } from '../internal/validation/index.js';
import { CssToolkitError } from '../internal/errors/index.js';

export interface TransitionItem {
  property: string;
  duration?: number | string;
  timingFunction?: string;
  delay?: number | string;
}

export interface TransitionOptions {
  property?: string;
  duration?: number | string;
  timingFunction?: string;
  delay?: number | string;
  transitions?: TransitionItem[];
  selector?: string;
}

export interface TransitionResult {
  transition: string;
  css: string;
}

function formatSingleTransition(item: TransitionItem): string {
  const prop = item.property.trim();
  if (prop !== 'all' && prop !== 'none') {
    validateIdentifier(prop, 'transition property');
  }

  let durStr = '0.3s';
  if (item.duration !== undefined) {
    if (typeof item.duration === 'number') {
      validateNumber(item.duration, 'transition duration', 0);
      durStr = `${item.duration}s`;
    } else {
      durStr = formatDimension(item.duration, 's');
    }
  }

  const tf = item.timingFunction ?? 'ease';

  let delayStr = '';
  if (item.delay !== undefined) {
    if (typeof item.delay === 'number') {
      delayStr = ` ${item.delay}s`;
    } else {
      delayStr = ` ${formatDimension(item.delay, 's')}`;
    }
  }

  return `${prop} ${durStr} ${tf}${delayStr}`;
}

export function generateTransition(options: TransitionOptions | TransitionItem[]): TransitionResult {
  let items: TransitionItem[] = [];

  if (Array.isArray(options)) {
    items = options;
  } else if (options.transitions) {
    items = options.transitions;
  } else if (options.property) {
    items = [
      {
        property: options.property,
        duration: options.duration,
        timingFunction: options.timingFunction,
        delay: options.delay,
      },
    ];
  } else {
    items = [
      {
        property: 'all',
        duration: options.duration ?? '0.3s',
        timingFunction: options.timingFunction ?? 'ease',
        delay: options.delay,
      },
    ];
  }

  if (items.length === 0) {
    throw new CssToolkitError('Transition requires at least one property', 'INVALID_PROPERTY');
  }

  const formatted = items.map(formatSingleTransition).join(', ');
  const decl = `transition: ${formatted};`;
  const selector = !Array.isArray(options) ? options.selector : undefined;
  const css = selector ? `${selector} {\n  ${decl}\n}` : decl;

  return {
    transition: formatted,
    css,
  };
}
