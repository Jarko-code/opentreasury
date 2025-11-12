import { useAccountsStore } from '@/stores/accountsStore';

export function useAccounts() {
    const accountsStore = useAccountsStore();

    function resolveAccountName(id: string): string {
        return accountsStore.getAccountName(id);
    }

    return {
        resolveAccountName
    };
}
