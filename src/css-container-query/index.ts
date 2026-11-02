import { validateIdentifier, formatDimension } from '../internal/validation/index.js';
import { formatDeclarations } from '../internal/css-serializer/index.js';
import { CssToolkitError } from '../internal/errors/index.js';

export type ContainerType = 'normal' | 'size' | 'inline-size';

export interface ContainerQueryOptions {
  containerName?: string;
  containerType?: ContainerType;
  containerSelector?: string;
  targetSelector?: string;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  declarations?: Record<string, string | number>;
}

export interface ContainerQueryResult {
  containerCss: string;
  queryCss: string;
  fullCss: string;
  condition: string;
}

export function generateContainerQuery(options: ContainerQueryOptions): ContainerQueryResult {
  const containerType: ContainerType = options.containerType ?? 'inline-size';
  if (containerType !== 'normal' && containerType !== 'size' && containerType !== 'inline-size') {
    throw new CssToolkitError(`Invalid containerType: ${containerType}`, 'INVALID_CONTAINER_QUERY');
  }

  if (options.containerName) {
    validateIdentifier(options.containerName, 'containerName');
  }

  const conditions: string[] = [];

  if (options.minWidth !== undefined) {
    conditions.push(`(min-width: ${formatDimension(options.minWidth)})`);
  }
  if (options.maxWidth !== undefined) {
    conditions.push(`(max-width: ${formatDimension(options.maxWidth)})`);
  }
  if (options.minHeight !== undefined) {
    conditions.push(`(min-height: ${formatDimension(options.minHeight)})`);
  }
  if (options.maxHeight !== undefined) {
    conditions.push(`(max-height: ${formatDimension(options.maxHeight)})`);
  }

  if (conditions.length === 0) {
    throw new CssToolkitError('Container query requires at least one condition (minWidth, maxWidth, etc.)', 'INVALID_CONTAINER_QUERY');
  }

  const conditionStr = conditions.join(' and ');
  const queryHeader = options.containerName
    ? `@container ${options.containerName} ${conditionStr}`
    : `@container ${conditionStr}`;

  const containerSel = options.containerSelector ?? '.container';
  const targetSel = options.targetSelector ?? '.child';
  const decls = options.declarations ?? {};

  const containerDecls: Record<string, string> = {
    'container-type': containerType,
  };
  if (options.containerName) {
    containerDecls['container-name'] = options.containerName;
  }

  const containerCss = `${containerSel} {\n${formatDeclarations(containerDecls, '  ')}\n}`;
  const targetFormatted = formatDeclarations(decls, '    ');
  const innerRule = targetFormatted ? `  ${targetSel} {\n${targetFormatted}\n  }` : `  ${targetSel} {}`;
  const queryCss = `${queryHeader} {\n${innerRule}\n}`;
  const fullCss = `${containerCss}\n\n${queryCss}`;

  return {
    containerCss,
    queryCss,
    fullCss,
    condition: conditionStr,
  };
}
