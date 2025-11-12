import type { ValueConverter } from './value-converter';

export class DateConverter implements ValueConverter {
    matches(value: unknown, explicitType?: string): boolean {
        return explicitType === 'date' || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value));
    }

    convert(value: unknown): Date {
        return new Date(value as string);
    }
}
