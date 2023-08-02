import Decimal from 'decimal.js';
import { ValueTransformer } from 'typeorm';

export class DecimalTransformer implements ValueTransformer {
  /**
   * Used to marshal Decimal when writing to the database.
   */
  to(decimal?: Decimal): string | null {
    return decimal?.toString() ?? null;
  }
  /**
   * Used to unmarshal Decimal when reading from the database.
   */
  from(decimal?: string): Decimal | null {
    return decimal ? new Decimal(decimal) : null;
  }
}

export const DecimalToString =
  (decimals: number = 2) =>
  (decimal?: Decimal) =>
    decimal?.toFixed?.(decimals) || decimal;

export const decimalValidator = (v: string) => {
  try {
    const value = new Decimal(v);
    if (value.isNaN()) {
      throw new Error();
    }
    return true;
  } catch {
    return false;
  }
};
