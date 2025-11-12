import { createI18n } from 'vue-i18n';
import { cz, en } from '@/i18n/locales';
import { numberFormats } from '@/i18n/number-formats.js';

const messages = {
    cz: cz,
    en: en
};

export const i18n = createI18n({
    globalInjection: true,
    legacy: false,
    locale: 'cz' || 'en', // set locale
    fallbackLocale: 'en', // set fallback locale
    numberFormats,
    messages, // set locale messages,
});
