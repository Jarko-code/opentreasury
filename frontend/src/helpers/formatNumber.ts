export const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '';
    const numeric = Number(value) / 100;
    const formatted = new Intl.NumberFormat('cs-CZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numeric);
    return formatted;
};
