import {  format } from 'date-fns';

//FIXME - HIGHT priority
//TODO  useles, na api vstvu posilam datum, jak si to ona prelozi pro bakend me nezajima zde!
export const formatDateForBackend = (date: Date | null | undefined): string | null => {
    if (!date) return null;
    return format(date, "yyyy-MM-dd'T'HH:mm:ss");
};

/**
 * Format datum do tabulek a vypis na UI, mimo DAteInputComponent, ta se o to stara diky masce sama.
 * @param {string|Date} timestamp - Timestamp or Date object
 * @param {boolean} includeTime - Whether to include time in the format
 * @returns {string} Formatted date string DD.MM.YYYY or DD.MM.YYYY HH:mm
 */

export function formatDate(timestamp: Date | string, includeTime: boolean = true): string {
    if (!timestamp) return '';

    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

    if (isNaN(date.getTime())) return '';

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: includeTime ? '2-digit' : undefined,
        minute: includeTime ? '2-digit' : undefined
    };

    return date.toLocaleString('cs-CZ', options);
}
