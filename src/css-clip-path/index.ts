import { formatDimension } from '../internal/validation/index.js';
import { CssToolkitError } from '../internal/errors/index.js';

export type ClipPathShape = 'polygon' | 'circle' | 'ellipse' | 'inset';

export type PointCoord = number | string;
export type Point = [PointCoord, PointCoord] | { x: PointCoord; y: PointCoord };

export interface CircleClipOptions {
  shape: 'circle';
  radius?: PointCoord;
  at?: { x: PointCoord; y: PointCoord };
}

export interface EllipseClipOptions {
  shape: 'ellipse';
  rx?: PointCoord;
  ry?: PointCoord;
  at?: { x: PointCoord; y: PointCoord };
}

export interface InsetClipOptions {
  shape: 'inset';
  top?: PointCoord;
  right?: PointCoord;
  bottom?: PointCoord;
  left?: PointCoord;
  round?: PointCoord;
}

export interface PolygonClipOptions {
  shape: 'polygon';
  points: Point[];
}

export type ClipPathOptions =
  | CircleClipOptions
  | EllipseClipOptions
  | InsetClipOptions
  | PolygonClipOptions;

export interface ClipPathResult {
  clipPath: string;
  css: string;
  shape: ClipPathShape;
}

function formatPoint(coord: PointCoord, defaultUnit = '%'): string {
  if (typeof coord === 'number') {
    return `${coord}${defaultUnit}`;
  }
  return formatDimension(coord, defaultUnit);
}

export function generateClipPath(options: ClipPathOptions): ClipPathResult {
  if (!options || typeof options !== 'object' || !options.shape) {
    throw new CssToolkitError('Options must specify a valid clip-path shape', 'INVALID_CLIP_PATH');
  }

  let clipPathVal = '';

  switch (options.shape) {
    case 'polygon': {
      if (!Array.isArray(options.points) || options.points.length < 3) {
        throw new CssToolkitError('Polygon requires at least 3 points', 'INVALID_CLIP_PATH');
      }
      const formattedPoints = options.points.map((pt) => {
        let x: PointCoord;
        let y: PointCoord;
        if (Array.isArray(pt)) {
          if (pt.length !== 2) {
            throw new CssToolkitError('Polygon point tuple must contain exactly [x, y]', 'INVALID_CLIP_PATH');
          }
          x = pt[0]!;
          y = pt[1]!;
        } else if (typeof pt === 'object' && pt !== null && 'x' in pt && 'y' in pt) {
          x = pt.x;
          y = pt.y;
        } else {
          throw new CssToolkitError('Invalid point format in polygon points', 'INVALID_CLIP_PATH');
        }
        return `${formatPoint(x)} ${formatPoint(y)}`;
      });
      clipPathVal = `polygon(${formattedPoints.join(', ')})`;
      break;
    }

    case 'circle': {
      const radius = options.radius !== undefined ? formatPoint(options.radius) : '50%';
      if (options.at) {
        const atX = formatPoint(options.at.x);
        const atY = formatPoint(options.at.y);
        clipPathVal = `circle(${radius} at ${atX} ${atY})`;
      } else {
        clipPathVal = `circle(${radius})`;
      }
      break;
    }

    case 'ellipse': {
      const rx = options.rx !== undefined ? formatPoint(options.rx) : '50%';
      const ry = options.ry !== undefined ? formatPoint(options.ry) : '50%';
      if (options.at) {
        const atX = formatPoint(options.at.x);
        const atY = formatPoint(options.at.y);
        clipPathVal = `ellipse(${rx} ${ry} at ${atX} ${atY})`;
      } else {
        clipPathVal = `ellipse(${rx} ${ry})`;
      }
      break;
    }

    case 'inset': {
      const top = formatPoint(options.top ?? 0);
      const right = formatPoint(options.right ?? 0);
      const bottom = formatPoint(options.bottom ?? 0);
      const left = formatPoint(options.left ?? 0);
      let insetStr = `inset(${top} ${right} ${bottom} ${left}`;
      if (options.round !== undefined) {
        insetStr += ` round ${formatPoint(options.round)}`;
      }
      insetStr += ')';
      clipPathVal = insetStr;
      break;
    }

    default:
      throw new CssToolkitError(`Unsupported clip-path shape: ${(options as any).shape}`, 'INVALID_CLIP_PATH');
  }

  return {
    clipPath: clipPathVal,
    css: `clip-path: ${clipPathVal};`,
    shape: options.shape,
  };
}
