export interface ValueConverter {
    matches(value: unknown, explicitType?: string): boolean;
    convert(value: unknown): any;
}
