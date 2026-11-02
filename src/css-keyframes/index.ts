import { validateIdentifier, formatDimension } from '../internal/validation/index.js';
import { formatDeclarations } from '../internal/css-serializer/index.js';
import { CssToolkitError } from '../internal/errors/index.js';

export interface KeyframeAnimationOptions {
  duration?: number | string;
  timingFunction?: string;
  delay?: number | string;
  iterationCount?: number | string;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  playState?: 'running' | 'paused';
}

export interface KeyframesOptions {
  name: string;
  keyframes: Record<string, Record<string, string | number>>;
  animation?: KeyframeAnimationOptions;
}

export interface KeyframesResult {
  keyframesCss: string;
  animationDeclaration?: string;
  css: string;
}

function validateStopKey(key: string): string {
  const trimmed = key.trim();
  if (trimmed === 'from' || trimmed === 'to') {
    return trimmed;
  }
  if (/^\d{1,3}%$/.test(trimmed)) {
    const val = parseInt(trimmed.slice(0, -1), 10);
    if (val >= 0 && val <= 100) {
      return trimmed;
    }
  }
  throw new CssToolkitError(`Invalid keyframe stop: "${key}". Must be "from", "to", or 0%-100%`, 'INVALID_KEYFRAMES');
}

export function generateKeyframes(options: KeyframesOptions): KeyframesResult {
  validateIdentifier(options.name, 'animation name');

  const stopEntries = Object.entries(options.keyframes);
  if (stopEntries.length === 0) {
    throw new CssToolkitError('Keyframes definition cannot be empty', 'INVALID_KEYFRAMES');
  }

  const renderedBlocks: string[] = [];

  for (const [stopKey, decls] of stopEntries) {
    const validStop = validateStopKey(stopKey);
    const formatted = formatDeclarations(decls, '    ');
    if (!formatted) {
      renderedBlocks.push(`  ${validStop} {}`);
    } else {
      renderedBlocks.push(`  ${validStop} {\n${formatted}\n  }`);
    }
  }

  const keyframesCss = `@keyframes ${options.name} {\n${renderedBlocks.join('\n')}\n}`;

  let animDecl: string | undefined;
  if (options.animation) {
    const anim = options.animation;
    const dur = anim.duration !== undefined ? formatDimension(anim.duration, 's') : '1s';
    const tf = anim.timingFunction ?? 'ease';
    const del = anim.delay !== undefined ? formatDimension(anim.delay, 's') : '0s';
    const iter = anim.iterationCount !== undefined ? String(anim.iterationCount) : 'infinite';
    const dir = anim.direction ?? 'normal';
    const fill = anim.fillMode ?? 'none';
    const state = anim.playState ?? 'running';

    animDecl = `animation: ${options.name} ${dur} ${tf} ${del} ${iter} ${dir} ${fill} ${state};`;
  }

  const fullCss = animDecl ? `${keyframesCss}\n\n/* Usage */\n.animated {\n  ${animDecl}\n}` : keyframesCss;

  return {
    keyframesCss,
    animationDeclaration: animDecl,
    css: fullCss,
  };
}
