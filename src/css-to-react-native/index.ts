import { parseCssSafely } from '../internal/css-parser/index.js';
import { parseColor, convertColor } from '../internal/color/parser.js';

export interface UnsupportedDeclaration {
  property: string;
  value: string;
  reason: string;
}

export interface CssToReactNativeResult {
  styles: Record<string, any>;
  unsupported: UnsupportedDeclaration[];
  warnings: string[];
}

export interface CssToReactNativeOptions {
  rootFontSize?: number;
}

function parseUnitValue(val: string, rootFontSize = 16): number | string {
  const trimmed = val.trim();
  if (trimmed === '0') return 0;
  if (/^-?\d+(\.\d+)?px$/i.test(trimmed)) {
    return parseFloat(trimmed.slice(0, -2));
  }
  if (/^-?\d+(\.\d+)?rem$/i.test(trimmed)) {
    return parseFloat(trimmed.slice(0, -3)) * rootFontSize;
  }
  if (/^-?\d+(\.\d+)?%$/i.test(trimmed)) {
    return trimmed; // React Native supports percentage strings for dimensions
  }
  if (/^-?\d+(\.\d+)?$/i.test(trimmed)) {
    return parseFloat(trimmed);
  }
  return trimmed;
}

export function cssToReactNative(
  css: string,
  options?: CssToReactNativeOptions
): CssToReactNativeResult {
  const root = parseCssSafely(css);
  const rootFontSize = options?.rootFontSize ?? 16;
  const styles: Record<string, any> = {};
  const unsupported: UnsupportedDeclaration[] = [];
  const warnings: string[] = [];

  root.walkDecls((decl) => {
    const prop = decl.prop.toLowerCase();
    const val = decl.value.trim();

    try {
      switch (prop) {
        // Dimensions & Spacing
        case 'width':
        case 'height':
        case 'min-width':
        case 'max-width':
        case 'min-height':
        case 'max-height':
        case 'top':
        case 'right':
        case 'bottom':
        case 'left':
        case 'margin':
        case 'margin-top':
        case 'margin-right':
        case 'margin-bottom':
        case 'margin-left':
        case 'padding':
        case 'padding-top':
        case 'padding-right':
        case 'padding-bottom':
        case 'padding-left':
        case 'gap':
        case 'row-gap':
        case 'column-gap': {
          const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          styles[camel] = parseUnitValue(val, rootFontSize);
          break;
        }

        // Flexbox & Layout
        case 'flex-direction':
          styles.flexDirection = val;
          break;
        case 'flex-wrap':
          styles.flexWrap = val;
          break;
        case 'justify-content':
          styles.justifyContent = val;
          break;
        case 'align-items':
          styles.alignItems = val;
          break;
        case 'align-self':
          styles.alignSelf = val;
          break;
        case 'align-content':
          styles.alignContent = val;
          break;
        case 'flex-grow':
          styles.flexGrow = parseFloat(val);
          break;
        case 'flex-shrink':
          styles.flexShrink = parseFloat(val);
          break;
        case 'flex-basis':
          styles.flexBasis = parseUnitValue(val, rootFontSize);
          break;
        case 'flex':
          styles.flex = parseFloat(val);
          break;
        case 'position':
          styles.position = val === 'absolute' || val === 'relative' ? val : 'relative';
          if (val !== 'absolute' && val !== 'relative') {
            warnings.push(`Position "${val}" is not supported in React Native; defaulted to "relative"`);
          }
          break;
        case 'z-index':
          styles.zIndex = parseInt(val, 10);
          break;
        case 'overflow':
          styles.overflow = val === 'hidden' || val === 'scroll' || val === 'visible' ? val : 'visible';
          break;
        case 'display':
          if (val === 'none' || val === 'flex') {
            styles.display = val;
          } else {
            unsupported.push({ property: prop, value: val, reason: `display: ${val} is not supported in React Native` });
          }
          break;

        // Typography & Colors
        case 'color':
          styles.color = convertColor(parseColor(val).rgb);
          break;
        case 'background-color':
          styles.backgroundColor = convertColor(parseColor(val).rgb);
          break;
        case 'font-size':
          styles.fontSize = parseUnitValue(val, rootFontSize);
          break;
        case 'font-weight':
          styles.fontWeight = String(val);
          break;
        case 'font-style':
          styles.fontStyle = val;
          break;
        case 'line-height':
          styles.lineHeight = parseUnitValue(val, rootFontSize);
          break;
        case 'text-align':
          styles.textAlign = val;
          break;
        case 'letter-spacing':
          styles.letterSpacing = parseUnitValue(val, rootFontSize);
          break;
        case 'opacity':
          styles.opacity = parseFloat(val);
          break;

        // Borders
        case 'border-radius':
          styles.borderRadius = parseUnitValue(val, rootFontSize);
          break;
        case 'border-top-left-radius':
        case 'border-top-right-radius':
        case 'border-bottom-left-radius':
        case 'border-bottom-right-radius':
        case 'border-width':
        case 'border-top-width':
        case 'border-right-width':
        case 'border-bottom-width':
        case 'border-left-width': {
          const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          styles[camel] = parseUnitValue(val, rootFontSize);
          break;
        }
        case 'border-color':
          styles.borderColor = convertColor(parseColor(val).rgb);
          break;
        case 'border-style':
          styles.borderStyle = val;
          break;

        default:
          unsupported.push({
            property: prop,
            value: val,
            reason: `Property "${prop}" is not mapped to React Native style`,
          });
          break;
      }
    } catch (err) {
      unsupported.push({
        property: prop,
        value: val,
        reason: err instanceof Error ? err.message : String(err),
      });
    }
  });

  return {
    styles,
    unsupported,
    warnings,
  };
}
