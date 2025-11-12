import { DateConverter, NumberConverter, NestedObjectConverter, ValueConverter } from './Converters';

const converters: ValueConverter[] = [new DateConverter(), new NumberConverter(), new NestedObjectConverter()];

export function convertApiValues<T>(data: T, fieldTypes?: Record<string, string>): T {
    if (Array.isArray(data)) {
        return data.map((item) => convertApiValues(item, fieldTypes)) as unknown as T;
    }

    return data && typeof data === 'object'
        ? (Object.entries(data).reduce(
              (acc, [key, value]) => {
                  const explicitType = fieldTypes?.[key];
                  const converter = converters.find((c) => c.matches(value, explicitType));
                  return { ...acc, [key]: converter ? converter.convert(value) : value };
              },
              {} as Record<string, unknown>,
          ) as T)
        : data;
}
