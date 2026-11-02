export type ErrorCode =
  | 'INVALID_COLOR'
  | 'INVALID_CSS'
  | 'INVALID_SELECTOR'
  | 'INVALID_UNIT'
  | 'MISSING_CONTEXT'
  | 'INVALID_PROPERTY'
  | 'INVALID_TRANSFORM'
  | 'INVALID_GRID'
  | 'INVALID_KEYFRAMES'
  | 'INVALID_CLAMP'
  | 'INVALID_CLIP_PATH'
  | 'INVALID_CUBIC_BEZIER'
  | 'INVALID_CONTAINER_QUERY'
  | 'INVALID_FILTER'
  | 'INVALID_SHADOW'
  | 'INVALID_BORDER_RADIUS'
  | 'SCSS_COMPILATION_ERROR'
  | 'TAILWIND_COMPILATION_ERROR'
  | 'UNSUPPORTED_CONVERSION'
  | 'SECURITY_ERROR';

export interface SourceLocation {
  line?: number;
  column?: number;
  file?: string;
}

export class CssToolkitError extends Error {
  readonly code: ErrorCode;
  readonly location?: SourceLocation;

  constructor(message: string, code: ErrorCode, location?: SourceLocation) {
    super(message);
    this.name = 'CssToolkitError';
    this.code = code;
    this.location = location;
    Object.setPrototypeOf(this, CssToolkitError.prototype);
  }
}
