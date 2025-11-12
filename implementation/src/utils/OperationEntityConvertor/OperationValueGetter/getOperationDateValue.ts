import { Nullable } from '../../types.js';

export const getOperationDateTimeValue = (value: Nullable<Date>) => {
    //todo check if this is correct
    return value ? getLocalISOString(value) : null;
};

function getLocalISOString(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // měsíce jsou 0-indexované
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const ms = date.getMilliseconds();

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}`;
}

export const getOperationDateValue = (value: Nullable<Date>) => {
    //Ono se to sice ulozi s casem, ale pokud to poslu jako UTC cas tak to vezme jen den utc (coz je den minus) a prida to k tomu cas utc, takze to defakto posune o cely den dozadu
    if (!value) return null;
    const originalDate = new Date(value);

    const newDate = new Date(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate() + 1);
    return newDate.toISOString().slice(0, 10);
};
