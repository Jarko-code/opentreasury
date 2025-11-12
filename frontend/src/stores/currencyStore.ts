import { defineStore } from 'pinia';
import { useServiceAPI } from '@/service-api';
import type { OpenTreasuryCurrency } from '@opentreasury/opentreasury-service-api';

export const useCurrencyStore = defineStore('currency', {
    state: () => ({
        serviceAPI: useServiceAPI(),
        currencies: [] as OpenTreasuryCurrency[]
    }),

    actions: {
        async fetchAllCurrencies(): Promise<void> {
            try {
                const response = (await this.serviceAPI.currencyService.fetchAllCurrencies()) ?? [];
                this.currencies = response;
            } catch (error) {
                console.error('Error in fetchAllCurrencies:', error);
            }
        }
    }
});
