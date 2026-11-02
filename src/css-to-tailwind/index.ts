import { parseCssSafely } from '../internal/css-parser/index.js';
import { colorToTailwind } from '../color-to-tailwind/index.js';

export interface CssToTailwindOptions {
  version?: 'v3' | 'v4';
  palette?: Record<string, Record<string, string> | string>;
  allowArbitraryValues?: boolean;
}

export interface CssToTailwindResult {
  classes: string[];
  unsupported: Array<{ property: string; value: string; reason?: string }>;
  warnings: string[];
}

const SPACING_MAP: Record<string, string> = {
  '0px': '0',
  '1px': 'px',
  '2px': '0.5',
  '4px': '1',
  '6px': '1.5',
  '8px': '2',
  '10px': '2.5',
  '12px': '3',
  '14px': '3.5',
  '16px': '4',
  '20px': '5',
  '24px': '6',
  '28px': '7',
  '32px': '8',
  '36px': '9',
  '40px': '10',
  '44px': '11',
  '48px': '12',
  '56px': '14',
  '64px': '16',
  '80px': '20',
  '96px': '24',
};

const FONT_SIZE_MAP: Record<string, string> = {
  '12px': 'text-xs',
  '14px': 'text-sm',
  '16px': 'text-base',
  '18px': 'text-lg',
  '20px': 'text-xl',
  '24px': 'text-2xl',
  '30px': 'text-3xl',
  '36px': 'text-4xl',
  '48px': 'text-5xl',
};

const FONT_WEIGHT_MAP: Record<string, string> = {
  '100': 'font-thin',
  '200': 'font-extralight',
  '300': 'font-light',
  '400': 'font-normal',
  '500': 'font-medium',
  '600': 'font-semibold',
  '700': 'font-bold',
  '800': 'font-extrabold',
  '900': 'font-black',
  normal: 'font-normal',
  bold: 'font-bold',
};

function mapSpacing(prefix: string, val: string, allowArbitrary: boolean): string | null {
  const normalized = val.trim();
  if (normalized in SPACING_MAP) {
    return `${prefix}-${SPACING_MAP[normalized]}`;
  }
  if (allowArbitrary) {
    return `${prefix}-[${normalized}]`;
  }
  return null;
}

export function cssToTailwind(
  css: string,
  options?: CssToTailwindOptions
): CssToTailwindResult {
  const root = parseCssSafely(css);
  const allowArbitrary = options?.allowArbitraryValues ?? true;
  const classes: string[] = [];
  const unsupported: Array<{ property: string; value: string; reason?: string }> = [];
  const warnings: string[] = [];

  root.walkDecls((decl) => {
    const prop = decl.prop.toLowerCase();
    const val = decl.value.trim();

    switch (prop) {
      // Display
      case 'display': {
        const displayMap: Record<string, string> = {
          flex: 'flex',
          'inline-flex': 'inline-flex',
          grid: 'grid',
          'inline-grid': 'inline-grid',
          block: 'block',
          'inline-block': 'inline-block',
          inline: 'inline',
          none: 'hidden',
        };
        if (val in displayMap) {
          classes.push(displayMap[val]!);
        } else {
          unsupported.push({ property: prop, value: val });
        }
        break;
      }

      // Spacing: Margin
      case 'margin': {
        const mapped = mapSpacing('m', val, allowArbitrary);
        if (mapped) classes.push(mapped);
        else unsupported.push({ property: prop, value: val });
        break;
      }
      case 'margin-top': {
        const mapped = mapSpacing('mt', val, allowArbitrary);
        if (mapped) classes.push(mapped);
        else unsupported.push({ property: prop, value: val });
        break;
      }
      case 'margin-right': {
        const mapped = mapSpacing('mr', val, allowArbitrary);
        if (mapped) classes.push(mapped);
        else unsupported.push({ property: prop, value: val });
        break;
      }
      case 'margin-bottom': {
        const mapped = mapSpacing('mb', val, allowArbitrary);
        if (mapped) classes.push(mapped);
        else unsupported.push({ property: prop, value: val });
        break;
      }
      case 'margin-left': {
        const mapped = mapSpacing('ml', val, allowArbitrary);
        if (mapped) classes.push(mapped);
        else unsupported.push({ property: prop, value: val });
        break;
      }

      // Spacing: Padding
      case 'padding': {
        const mapped = mapSpacing('p', val, allowArbitrary);
        if (mapped) classes.push(mapped);
        else unsupported.push({ property: prop, value: val });
        break;
      }
      case 'padding-top': {
        const mapped = mapSpacing('pt', val, allowArbitrary);
        if (mapped) classes.push(mapped);
        else unsupported.push({ property: prop, value: val });
        break;
      }
      case 'padding-right': {
        const mapped = mapSpacing('pr', val, allowArbitrary);
        if (mapped) classes.push(mapped);
        else unsupported.push({ property: prop, value: val });
        break;
      }
      case 'padding-bottom': {
        const mapped = mapSpacing('pb', val, allowArbitrary);
        if (mapped) classes.push(mapped);
        else unsupported.push({ property: prop, value: val });
        break;
      }
      case 'padding-left': {
        const mapped = mapSpacing('pl', val, allowArbitrary);
        if (mapped) classes.push(mapped);
        else unsupported.push({ property: prop, value: val });
        break;
      }

      // Dimensions
      case 'width': {
        if (val === '100%') {
          classes.push('w-full');
        } else if (val === '100vw') {
          classes.push('w-screen');
        } else {
          const mapped = mapSpacing('w', val, allowArbitrary);
          if (mapped) classes.push(mapped);
          else unsupported.push({ property: prop, value: val });
        }
        break;
      }
      case 'height': {
        if (val === '100%') {
          classes.push('h-full');
        } else if (val === '100vh') {
          classes.push('h-screen');
        } else {
          const mapped = mapSpacing('h', val, allowArbitrary);
          if (mapped) classes.push(mapped);
          else unsupported.push({ property: prop, value: val });
        }
        break;
      }

      // Gap
      case 'gap': {
        const mapped = mapSpacing('gap', val, allowArbitrary);
        if (mapped) classes.push(mapped);
        else unsupported.push({ property: prop, value: val });
        break;
      }

      // Colors: background-color, color, border-color
      case 'background-color':
      case 'background': {
        if (val.startsWith('#') || val.startsWith('rgb') || val.startsWith('hsl')) {
          const match = colorToTailwind(val, {
            prefix: 'bg-',
            palette: options?.palette,
            version: options?.version,
          });
          if (match.match && (match.match.exact || match.match.distance < 10)) {
            classes.push(match.match.className);
          } else if (allowArbitrary) {
            classes.push(`bg-[${val}]`);
          } else if (match.match) {
            classes.push(match.match.className);
            warnings.push(`Approximate color match used for "${val}": "${match.match.className}" (distance: ${match.match.distance})`);
          }
        } else {
          unsupported.push({ property: prop, value: val });
        }
        break;
      }
      case 'color': {
        const match = colorToTailwind(val, {
          prefix: 'text-',
          palette: options?.palette,
          version: options?.version,
        });
        if (match.match && (match.match.exact || match.match.distance < 10)) {
          classes.push(match.match.className);
        } else if (allowArbitrary) {
          classes.push(`text-[${val}]`);
        } else if (match.match) {
          classes.push(match.match.className);
          warnings.push(`Approximate color match used for "${val}": "${match.match.className}"`);
        }
        break;
      }
      case 'border-color': {
        const match = colorToTailwind(val, {
          prefix: 'border-',
          palette: options?.palette,
          version: options?.version,
        });
        if (match.match && (match.match.exact || match.match.distance < 10)) {
          classes.push(match.match.className);
        } else if (allowArbitrary) {
          classes.push(`border-[${val}]`);
        } else if (match.match) {
          classes.push(match.match.className);
        }
        break;
      }

      // Typography
      case 'font-size': {
        if (val in FONT_SIZE_MAP) {
          classes.push(FONT_SIZE_MAP[val]!);
        } else if (allowArbitrary) {
          classes.push(`text-[${val}]`);
        } else {
          unsupported.push({ property: prop, value: val });
        }
        break;
      }
      case 'font-weight': {
        if (val in FONT_WEIGHT_MAP) {
          classes.push(FONT_WEIGHT_MAP[val]!);
        } else {
          unsupported.push({ property: prop, value: val });
        }
        break;
      }
      case 'text-align': {
        const alignMap: Record<string, string> = {
          left: 'text-left',
          center: 'text-center',
          right: 'text-right',
          justify: 'text-justify',
        };
        if (val in alignMap) classes.push(alignMap[val]!);
        else unsupported.push({ property: prop, value: val });
        break;
      }

      // Flexbox
      case 'flex-direction': {
        const dirMap: Record<string, string> = {
          row: 'flex-row',
          'row-reverse': 'flex-row-reverse',
          column: 'flex-col',
          'column-reverse': 'flex-col-reverse',
        };
        if (val in dirMap) classes.push(dirMap[val]!);
        else unsupported.push({ property: prop, value: val });
        break;
      }
      case 'justify-content': {
        const jMap: Record<string, string> = {
          'flex-start': 'justify-start',
          'flex-end': 'justify-end',
          center: 'justify-center',
          'space-between': 'justify-between',
          'space-around': 'justify-around',
          'space-evenly': 'justify-evenly',
        };
        if (val in jMap) classes.push(jMap[val]!);
        else unsupported.push({ property: prop, value: val });
        break;
      }
      case 'align-items': {
        const aMap: Record<string, string> = {
          'flex-start': 'items-start',
          'flex-end': 'items-end',
          center: 'items-center',
          baseline: 'items-baseline',
          stretch: 'items-stretch',
        };
        if (val in aMap) classes.push(aMap[val]!);
        else unsupported.push({ property: prop, value: val });
        break;
      }

      // Border radius
      case 'border-radius': {
        const rMap: Record<string, string> = {
          '0px': 'rounded-none',
          '2px': 'rounded-sm',
          '4px': 'rounded',
          '6px': 'rounded-md',
          '8px': 'rounded-lg',
          '12px': 'rounded-xl',
          '16px': 'rounded-2xl',
          '24px': 'rounded-3xl',
          '9999px': 'rounded-full',
          '50%': 'rounded-full',
        };
        if (val in rMap) {
          classes.push(rMap[val]!);
        } else if (allowArbitrary) {
          classes.push(`rounded-[${val}]`);
        } else {
          unsupported.push({ property: prop, value: val });
        }
        break;
      }

      default:
        unsupported.push({ property: prop, value: val });
        break;
    }
  });

  return {
    classes,
    unsupported,
    warnings,
  };
}
