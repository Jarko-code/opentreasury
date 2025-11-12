import type { ValueConverter } from './value-converter';

export class NumberConverter implements ValueConverter {
    matches(value: unknown, explicitType?: string): boolean {
        return explicitType === 'number' || (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value));
    }

    convert(value: unknown): number {
        return Number(value);
    }
}
