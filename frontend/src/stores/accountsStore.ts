import { defineStore } from 'pinia';
import { useServiceAPI } from '@/service-api';
import type { OpenTreasuryAccount } from '@opentreasury/opentreasury-service-api';

export const useAccountsStore = defineStore('accounts', {
    state: () => ({
        serviceAPI: useServiceAPI(),
        accounts: new Map<string, OpenTreasuryAccount>(),
        totalAccounts: 0
    }),

    actions: {
        async fetchAllAccounts(): Promise<void> {
            try {
                const response = await this.serviceAPI.accountsService.fetchAllAccounts();
                if (Array.isArray(response)) {
                    this.accounts.clear();
                    response.forEach((acc) => {
                        this.accounts.set(acc.id ?? '', acc);
                    });
                    this.totalAccounts = response.length;
                }
            } catch (error) {
                console.error('Error in fetchAllAccounts:', error);
            }
        },

        // Ak potrebuješ názov priamo
        getAccountName(id: string): string {
            return this.accounts.get(id)?.name ?? id;
        }
    }
});
