import { generateGradient, type GradientOptions } from '../css-gradient/index.js';

export interface GradientTextOptions extends GradientOptions {
  selector?: string;
  fallbackColor?: string;
}

export interface GradientTextResult {
  gradient: string;
  declarations: Record<string, string>;
  css: string;
}

export function generateGradientText(options: GradientTextOptions): GradientTextResult {
  const gradResult = generateGradient(options);

  const decls: Record<string, string> = {
    'background-image': gradResult.gradient,
    '-webkit-background-clip': 'text',
    'background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    color: 'transparent',
  };

  const sel = options.selector;
  const lines = Object.entries(decls).map(([k, v]) => `${sel ? '  ' : ''}${k}: ${v};`);
  const css = sel ? `${sel} {\n${lines.join('\n')}\n}` : lines.join('\n');

  return {
    gradient: gradResult.gradient,
    declarations: decls,
    css,
  };
}
