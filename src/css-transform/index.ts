import { formatDimension, validateNumber } from '../internal/validation/index.js';
import { CssToolkitError } from '../internal/errors/index.js';

export type TransformType =
  | 'translate'
  | 'translateX'
  | 'translateY'
  | 'translateZ'
  | 'translate3d'
  | 'rotate'
  | 'rotateX'
  | 'rotateY'
  | 'rotateZ'
  | 'scale'
  | 'scaleX'
  | 'scaleY'
  | 'scaleZ'
  | 'skew'
  | 'skewX'
  | 'skewY'
  | 'matrix'
  | 'matrix3d';

export interface TransformOperation {
  type: TransformType;
  value: number | string | Array<number | string>;
}

export interface TransformNamedOptions {
  translate?: [number | string, number | string];
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotate?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  scale?: number | [number, number];
  scaleX?: number;
  scaleY?: number;
  skew?: [number | string, number | string];
  skewX?: number | string;
  skewY?: number | string;
  transformOrigin?: string;
  selector?: string;
}

export interface TransformResult {
  transform: string;
  transformOrigin?: string;
  declarations: Record<string, string>;
  css: string;
}

function formatAngle(val: number | string): string {
  if (typeof val === 'number') {
    validateNumber(val, 'angle');
    return `${val}deg`;
  }
  return val.trim();
}

function formatSingleOperation(op: TransformOperation): string {
  switch (op.type) {
    case 'translate': {
      if (Array.isArray(op.value)) {
        const x = formatDimension(op.value[0] ?? 0);
        const y = formatDimension(op.value[1] ?? 0);
        return `translate(${x}, ${y})`;
      }
      return `translate(${formatDimension(op.value)})`;
    }
    case 'translateX':
      return `translateX(${formatDimension(op.value as number | string)})`;
    case 'translateY':
      return `translateY(${formatDimension(op.value as number | string)})`;
    case 'translateZ':
      return `translateZ(${formatDimension(op.value as number | string)})`;
    case 'translate3d': {
      if (!Array.isArray(op.value) || op.value.length !== 3) {
        throw new CssToolkitError('translate3d requires exactly [x, y, z]', 'INVALID_TRANSFORM');
      }
      return `translate3d(${formatDimension(op.value[0]!)}, ${formatDimension(op.value[1]!)}, ${formatDimension(op.value[2]!)})`;
    }
    case 'rotate':
      return `rotate(${formatAngle(op.value as number | string)})`;
    case 'rotateX':
      return `rotateX(${formatAngle(op.value as number | string)})`;
    case 'rotateY':
      return `rotateY(${formatAngle(op.value as number | string)})`;
    case 'rotateZ':
      return `rotateZ(${formatAngle(op.value as number | string)})`;
    case 'scale': {
      if (Array.isArray(op.value)) {
        return `scale(${op.value[0]}, ${op.value[1]})`;
      }
      return `scale(${op.value})`;
    }
    case 'scaleX':
      return `scaleX(${op.value})`;
    case 'scaleY':
      return `scaleY(${op.value})`;
    case 'scaleZ':
      return `scaleZ(${op.value})`;
    case 'skew': {
      if (Array.isArray(op.value)) {
        return `skew(${formatAngle(op.value[0] ?? 0)}, ${formatAngle(op.value[1] ?? 0)})`;
      }
      return `skew(${formatAngle(op.value as number | string)})`;
    }
    case 'skewX':
      return `skewX(${formatAngle(op.value as number | string)})`;
    case 'skewY':
      return `skewY(${formatAngle(op.value as number | string)})`;
    case 'matrix': {
      if (!Array.isArray(op.value) || op.value.length !== 6) {
        throw new CssToolkitError('matrix requires 6 numbers', 'INVALID_TRANSFORM');
      }
      return `matrix(${op.value.join(', ')})`;
    }
    case 'matrix3d': {
      if (!Array.isArray(op.value) || op.value.length !== 16) {
        throw new CssToolkitError('matrix3d requires 16 numbers', 'INVALID_TRANSFORM');
      }
      return `matrix3d(${op.value.join(', ')})`;
    }
    default:
      throw new CssToolkitError(`Unsupported transform function: ${String(op.type)}`, 'INVALID_TRANSFORM');
  }
}

export function generateTransform(
  input: TransformNamedOptions | TransformOperation[]
): TransformResult {
  const parts: string[] = [];
  let transformOrigin: string | undefined;
  let selector: string | undefined;

  if (Array.isArray(input)) {
    for (const op of input) {
      parts.push(formatSingleOperation(op));
    }
  } else if (typeof input === 'object' && input !== null) {
    selector = input.selector;
    transformOrigin = input.transformOrigin;

    if (input.translate !== undefined) parts.push(formatSingleOperation({ type: 'translate', value: input.translate }));
    if (input.translateX !== undefined) parts.push(formatSingleOperation({ type: 'translateX', value: input.translateX }));
    if (input.translateY !== undefined) parts.push(formatSingleOperation({ type: 'translateY', value: input.translateY }));
    if (input.translateZ !== undefined) parts.push(formatSingleOperation({ type: 'translateZ', value: input.translateZ }));

    if (input.rotate !== undefined) parts.push(formatSingleOperation({ type: 'rotate', value: input.rotate }));
    if (input.rotateX !== undefined) parts.push(formatSingleOperation({ type: 'rotateX', value: input.rotateX }));
    if (input.rotateY !== undefined) parts.push(formatSingleOperation({ type: 'rotateY', value: input.rotateY }));
    if (input.rotateZ !== undefined) parts.push(formatSingleOperation({ type: 'rotateZ', value: input.rotateZ }));

    if (input.scale !== undefined) parts.push(formatSingleOperation({ type: 'scale', value: input.scale }));
    if (input.scaleX !== undefined) parts.push(formatSingleOperation({ type: 'scaleX', value: input.scaleX }));
    if (input.scaleY !== undefined) parts.push(formatSingleOperation({ type: 'scaleY', value: input.scaleY }));

    if (input.skew !== undefined) parts.push(formatSingleOperation({ type: 'skew', value: input.skew }));
    if (input.skewX !== undefined) parts.push(formatSingleOperation({ type: 'skewX', value: input.skewX }));
    if (input.skewY !== undefined) parts.push(formatSingleOperation({ type: 'skewY', value: input.skewY }));
  } else {
    throw new CssToolkitError('Input must be a transform object or array of operations', 'INVALID_TRANSFORM');
  }

  const transformVal = parts.length > 0 ? parts.join(' ') : 'none';
  const decls: Record<string, string> = {
    transform: transformVal,
  };
  if (transformOrigin) {
    decls['transform-origin'] = transformOrigin;
  }

  const lines = Object.entries(decls).map(([k, v]) => `${selector ? '  ' : ''}${k}: ${v};`);
  const css = selector ? `${selector} {\n${lines.join('\n')}\n}` : lines.join('\n');

  return {
    transform: transformVal,
    transformOrigin,
    declarations: decls,
    css,
  };
}
