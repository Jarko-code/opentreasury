import { Nullable } from '../../types.js';

export const getDateValue = (value: Nullable<Date>) => {
    return value ? new Date(value) : null;
};
