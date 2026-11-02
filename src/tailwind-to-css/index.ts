import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { CssToolkitError } from '../internal/errors/index.js';
import { assertSafeCss } from '../internal/validation/index.js';

export interface TailwindToCssOptions {
  theme?: Record<string, any>;
  plugins?: any[];
  corePlugins?: any;
  darkMode?: 'media' | 'class';
  prefix?: string;
  important?: boolean;
}

export interface TailwindToCssResult {
  css: string;
  classes: string[];
}

export async function tailwindToCss(
  classes: string | string[],
  options?: TailwindToCssOptions
): Promise<TailwindToCssResult> {
  const classList = Array.isArray(classes)
    ? classes
    : classes.trim().split(/\s+/).filter(Boolean);

  if (classList.length === 0) {
    return {
      css: '',
      classes: [],
    };
  }

  for (const cls of classList) {
    assertSafeCss(cls);
  }

  const contentRaw = classList.join(' ');

  const twConfig: any = {
    content: [{ raw: contentRaw }],
    theme: options?.theme ?? {},
    plugins: options?.plugins ?? [],
    corePlugins: options?.corePlugins,
    darkMode: options?.darkMode ?? 'media',
    prefix: options?.prefix,
    important: options?.important,
  };

  try {
    const inputCss = '@tailwind utilities;';
    const result = await postcss([tailwindcss(twConfig)]).process(inputCss, {
      from: undefined,
    });

    return {
      css: result.css.trim(),
      classes: classList,
    };
  } catch (err: any) {
    throw new CssToolkitError(`Tailwind compilation failed: ${err.message}`, 'TAILWIND_COMPILATION_ERROR');
  }
}
