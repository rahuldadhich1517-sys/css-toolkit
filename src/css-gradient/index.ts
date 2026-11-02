import { formatDimension } from '../internal/validation/index.js';
import { parseColor, convertColor } from '../internal/color/parser.js';
import { CssToolkitError } from '../internal/errors/index.js';

export type GradientType = 'linear' | 'radial' | 'conic';

export interface GradientStop {
  color: string;
  position?: number | string;
}

export interface GradientOptions {
  type?: GradientType;
  repeating?: boolean;
  angle?: number | string;
  direction?: string;
  shape?: 'circle' | 'ellipse';
  position?: string;
  stops: Array<GradientStop | string>;
}

export interface GradientResult {
  gradient: string;
  css: string;
  type: GradientType;
}

function formatStop(stop: GradientStop | string): string {
  let colorStr: string;
  let posStr: string | undefined;

  if (typeof stop === 'string') {
    const parsed = parseColor(stop);
    colorStr = convertColor(parsed.rgb);
  } else if (typeof stop === 'object' && stop !== null && stop.color) {
    const parsed = parseColor(stop.color);
    colorStr = convertColor(parsed.rgb);
    if (stop.position !== undefined) {
      posStr = formatDimension(stop.position, '%');
    }
  } else {
    throw new CssToolkitError('Invalid gradient stop', 'INVALID_PROPERTY');
  }

  return posStr ? `${colorStr} ${posStr}` : colorStr;
}

export function generateGradient(options: GradientOptions): GradientResult {
  if (!options || !Array.isArray(options.stops) || options.stops.length < 2) {
    throw new CssToolkitError('Gradient requires at least 2 color stops', 'INVALID_PROPERTY');
  }

  const type = options.type ?? 'linear';
  const repeating = options.repeating ? 'repeating-' : '';
  const formattedStops = options.stops.map(formatStop).join(', ');

  let gradient = '';

  switch (type) {
    case 'linear': {
      let dirOrAngle = '';
      if (options.angle !== undefined) {
        dirOrAngle = typeof options.angle === 'number' ? `${options.angle}deg` : options.angle;
      } else if (options.direction) {
        dirOrAngle = options.direction;
      }
      const prefix = dirOrAngle ? `${dirOrAngle}, ` : '';
      gradient = `${repeating}linear-gradient(${prefix}${formattedStops})`;
      break;
    }

    case 'radial': {
      const parts: string[] = [];
      if (options.shape) parts.push(options.shape);
      if (options.position) {
        const pos = options.position.startsWith('at ') ? options.position : `at ${options.position}`;
        parts.push(pos);
      }
      const prefix = parts.length > 0 ? `${parts.join(' ')}, ` : '';
      gradient = `${repeating}radial-gradient(${prefix}${formattedStops})`;
      break;
    }

    case 'conic': {
      const parts: string[] = [];
      if (options.angle !== undefined) {
        const ang = typeof options.angle === 'number' ? `${options.angle}deg` : options.angle;
        parts.push(`from ${ang}`);
      }
      if (options.position) {
        const pos = options.position.startsWith('at ') ? options.position : `at ${options.position}`;
        parts.push(pos);
      }
      const prefix = parts.length > 0 ? `${parts.join(' ')}, ` : '';
      gradient = `${repeating}conic-gradient(${prefix}${formattedStops})`;
      break;
    }

    default:
      throw new CssToolkitError(`Unsupported gradient type: ${String(type)}`, 'INVALID_PROPERTY');
  }

  return {
    gradient,
    css: `background-image: ${gradient};`,
    type,
  };
}
