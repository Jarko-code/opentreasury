export const formatBoolean = (value: boolean | null | undefined): string => {
    if (value === null || value === undefined) return '';
    return value ? 'Ano' : 'Ne';
};
