import { ref, watch } from 'vue';
import { useAccounts } from '@/composables/operations/useAccounts';
import { useOperations } from '@/composables/operations/useOperations';
import type { Ref } from 'vue';

// Automatické dopĺňanie názvov účtov a operácií do lokálneho cache.
export function useReferenceNames(
    items: Ref<any[]> | any[],
    accountFields: Ref<string[]>,
    operationFields: Ref<string[]>
) {
    const { resolveAccountName } = useAccounts();
    const { resolveOperationName } = useOperations();

    const accountNames = ref<Record<string, string>>({});
    const operationNames = ref<Record<string, string>>({});

    watch(
        [items, accountFields, operationFields],
        async ([ops, accFields, opFields]) => {
            if (!Array.isArray(ops) || !ops.length) return;

            const accountIds = new Set<string>();
            const operationIds = new Set<string>();

            for (const op of ops) {
                accFields.forEach((field) => {
                    const id = op[field] ?? op.content?.[field];
                    if (id) accountIds.add(id);
                });
                opFields.forEach((field) => {
                    const id = op[field] ?? op.content?.[field];
                    if (id) operationIds.add(id);
                });
            }

            for (const id of accountIds) {
                if (!accountNames.value[id]) {
                    try {
                        accountNames.value[id] = await resolveAccountName(id);
                    } catch {
                        accountNames.value[id] = id;
                    }
                }
            }

            for (const id of operationIds) {
                if (!operationNames.value[id]) {
                    try {
                        operationNames.value[id] = await resolveOperationName(id);
                    } catch {
                        operationNames.value[id] = id;
                    }
                }
            }
        },
        { immediate: true, deep: true }
    );

    return { accountNames, operationNames };
}
