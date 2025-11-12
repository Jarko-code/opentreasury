import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

// PrimeVue
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

// i18n
import { i18n } from '@/i18n/i18n';

// font awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import serviceAPI, { SERVICE_API_SYM } from '@/service-api';

const app = createApp(App);
const pinia = createPinia();

serviceAPI.authorization.setTokenExpirationCallback(() => {
    app.config.globalProperties.$toast.add({
        severity: 'error',
        summary: 'Odhlašení',
        detail: 'Byli jste odhlášení z důvodu nečinnosti.',
        life: 10_000
    });
    router.push({ name: 'login' });
});

library.add(fas);

app.provide(SERVICE_API_SYM, serviceAPI);
app.use(pinia);
app.use(router);
app.use(i18n);
app.use(ConfirmationService);
app.use(ToastService);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.my-app-dark'
        }
    }
});

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
