export const shortId = (id: string | null | undefined, length = 5): string => {
    if (!id) return '';
    return id.slice(-length);
};
