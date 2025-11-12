<template>
    <GenericTable
        :subpageTitle="t('scripts.title')"
        :store="scriptStore"
        store-items-key="scripts"
        fetch-method="fetchAllScripts"
        :staticColumns="staticScriptColumns"
        :actionCol="true"
    >
        <template #actions="{ data }">
            <TableActions
                :id="data.id"
                :show-operation="true"
                :show-delete="true"
                :operation-tooltip="t('scripts.runScriptTooltip')"
                :delete-tooltip="t('default.delete')"
                @operation="() => handleScript(data.id)"
                @delete="() => handleDelete(data.id)"
            />
        </template>
    </GenericTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAlert } from '@/composables/useAlert';
import { useScriptsStore } from '@/stores/useScriptsStore';
import { useConfirmOperation } from '@/composables/useConfirmOperation';
import { useDeleteConfirm } from '@/composables/useDeleteConfirm';
import { useScriptColumns } from '@/components/processing/scripts/scripts.table.config';

const { t } = useI18n();
const scriptStore = useScriptsStore();
const { staticScriptColumns } = useScriptColumns();
const { error } = useAlert();
const { confirmOperation } = useConfirmOperation();
const { confirmDelete } = useDeleteConfirm();

const handleScript = async (id: string, values: Record<string, any> = {}) => {
    confirmOperation(
        async () => {
            try {
                await scriptStore.runSync(id, values);
            } catch {
                error(t('default.error'), t('default.operationError'));
            }
        },
        id,
        values
    );
};

const handleDelete = async (id: string) => {
    confirmDelete(async () => {
        try {
            await scriptStore.fetchAllScripts();
        } catch {
            error(t('default.error'), t('default.errorMessage'));
        }
    }, id);
};
</script>
