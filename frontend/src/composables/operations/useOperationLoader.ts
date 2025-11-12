import { ref } from 'vue';
import { useOperationsStore } from '@/stores/useOperationsStore';
import { useUserStore } from '@/stores/user-store';
import { findUserNameById } from '@/composables/useNameById';

/**
 * Načíta operáciu podľa ID a pripraví hodnoty pre formModel (vrátane formátovaných dátumov a názvov používateľov / skupín)
 */
export const useOperationLoader = () => {
    const operationsStore = useOperationsStore();
    const userStore = useUserStore();
    const loading = ref(false);

    const loadOperation = async (operationId: string, formModel: Record<string, any>) => {
        loading.value = true;

        try {
            const op = await operationsStore.fetchOperationById(operationId);

            await userStore.fetchAllSecurityGroups();
            if (userStore.fetchAllUsers) await userStore.fetchAllUsers();

            const findGroupNameById = (id: string | null | undefined) => {
                if (!id) return '';
                const group = userStore.securityGroups?.find?.((g: any) => g.id === id);
                return group?.name || id;
            };

            if (op) {
                Object.assign(formModel, {
                    id: op.id || '',
                    name: op.name || '',
                    creator: findUserNameById(op.creator) || '',
                    source: op.source || '',
                    createdTimestamp: op.createdTimestamp,
                    updatedBy: findUserNameById(op.updatedBy) || '',
                    updatedTimestamp: op.updatedTimestamp,
                    securityGroup: findGroupNameById(op.securityGroup) || '',
                    actualStatus: op.actualStatus || '',
                    ...op.content
                });
            }

            return op;
        } catch (err) {
            console.error('Failed to load operation or related data:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return { loadOperation, loading };
};
