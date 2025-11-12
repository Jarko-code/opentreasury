<!--
<template>
    <div v-if="scripts">
        <SubpageTitle :title="t('scripts.title')" />
        <DataTable
            :value="scripts"
            dataKey="id"
            scrollable
            resizableColumns
            columnResizeMode="expand"
            style="min-width: 60rem"
            scrollHeight="calc(100vh - 320px)"
            autoLayout
            showGridlines
            frozenHeader
        >
            <Column
                v-for="col in staticScriptColumns"
                :key="col.name"
                :field="col.name"
                :header="col.displayName"
                style="width: auto"
            >
                <template #body="slotProps">
                    <span>
                        {{ slotProps.data[col.name] ?? slotProps.data.content?.[col.name] ?? '' }}
                    </span>
                </template>
            </Column>

            &lt;!&ndash; Action buttons column &ndash;&gt;
            <Column
                :header="t('default.actions')"
                headerStyle="width: 8rem"
                bodyStyle="text-align:center"
            >
                <template #body="slotProps">
                    <TableActions
                        :id="slotProps.data.id"
                        :show-delete="true"
                        :show-operation="true"
                        :delete-tooltip="t('default.delete')"
                        :operation-tooltip="t('scripts.runScriptTooltip')"
                        @delete="handleDelete"
                        @operation="handleScript"
                    />
                </template>
            </Column>
        </DataTable>
    </div>

    <div v-else-if="loading">{{ t('default.loading') }}</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useAlert } from '@/composables/useAlert';
import { useScriptsStore } from '@/stores/useScriptsStore';
import { useScriptColumns } from '@/composables/processing/useScriptColumns';
import { useConfirmOperation } from '@/composables/useConfirmOperation';
import { useDeleteConfirm } from '@/composables/useDeleteConfirm';

const { t } = useI18n();
const { error } = useAlert();
const { confirmOperation } = useConfirmOperation();
const { confirmDelete } = useDeleteConfirm();
const scriptStore = useScriptsStore();
const { staticScriptColumns } = useScriptColumns();
const { scripts } = storeToRefs(scriptStore);
const loading = ref(false);

onMounted(async () => {
    loading.value = true;
    try {
        await scriptStore.fetchAllScripts();
    } catch {
        error(t('default.error'), t('default.errorMessage'));
    } finally {
        loading.value = false;
    }
});

const handleScript = async (id: string, values: Record<string, any> = {}) => {
    confirmOperation(
        async () => {
            try {
                await scriptStore.runSync(id, values);
            } catch {
                error(t('default.error'), t('default.operationError'));
            }
        }
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
-->
