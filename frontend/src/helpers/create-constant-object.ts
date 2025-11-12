/**
 * Utility function to create a constant object from array of strings
 * where each key equals its value
 */
export function createConstantObject<T extends Record<string, string>>(
    codes: readonly string[]
): T {
    return codes.reduce(
        (obj, item) => ({
            ...obj,
            [item]: item
        }),
        {} as T
    );
}
