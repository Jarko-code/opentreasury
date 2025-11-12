import type { IntlNumberFormats } from 'vue-i18n';

//TODO FIXME => cz neni cz ale cs-CZ!!!!!
export const numberFormats: IntlNumberFormats = {
    'cz': {
        currency: {
            style: 'currency',
            currency: 'CZK',
            minimumFractionDigits: 2
        },
        percent: {
            style: 'percent',
            minimumFractionDigits: 2
        },
        decimal: {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    }
};
