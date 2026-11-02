import {
  convertUnitInternal,
  type SupportedUnit,
  type UnitConversionContext,
} from '../internal/units/index.js';

export type { SupportedUnit, UnitConversionContext };

export function convertCssUnit(
  value: number,
  fromUnit: SupportedUnit,
  toUnit: SupportedUnit,
  options?: UnitConversionContext
): number {
  return convertUnitInternal(value, fromUnit, toUnit, options);
}
