import type { ValueConverter } from './value-converter';
import { convertApiValues } from '../convert-api-values';

export class NestedObjectConverter implements ValueConverter {
    matches(value: unknown, explicitType?: string): boolean {
        return Array.isArray(value) || typeof value === 'object';
    }

    convert(value: unknown): any {
        return convertApiValues(value);
    }
}
