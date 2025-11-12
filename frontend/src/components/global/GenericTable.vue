<template>
    <div v-if="tableData">
        <SubpageTitle :title="props.subpageTitle" />
        <DataTable
            :value="tableData"
            selectionMode="multiple"
            dataKey="id"
            scrollable
            resizableColumns
            columnResizeMode="expand"
            style="min-width: 60rem"
            scrollHeight="calc(100vh - 320px)"
            autoLayout
            showGridlines
            frozenHeader
            paginator
            :lazy="true"
            :rows="rowsPerPage"
            :totalRecords="totalRecords"
            :loading="loading"
            :rowsPerPageOptions="[5, 10, 25, 50, 100]"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            currentPageReportTemplate="{first} - {last} / {totalRecords}"
            @page="onPage"
            @sort="handleSort"
        >
            <!-- Column Data -->
            <Column
                v-for="col in props.staticColumns"
                :key="col.name"
                :field="col.name"
                :header="col.displayName"
                style="width: auto"
                sortable
            >
                <template #body="{ data, field }">
                    <span v-if="col.format">
                        {{
                            col.format(
                                typeof field === 'function'
                                    ? field(data)
                                    : (data as any)[field as string]
                            )
                        }}
                    </span>
                    <span v-else>
                        {{
                            typeof field === 'function'
                                ? field(data)
                                : (data as any)[field as string]
                        }}
                    </span>
                </template>
            </Column>

            <!-- Action buttons Column -->
            <Column
                v-if="props.actionCol"
                :header="t('default.actions')"
                headerStyle="width: 8rem"
                bodyStyle="text-align:center"
            >
                <template #body="{ data }">
                    <slot
                        name="actions"
                        :data="data"
                    />
                </template>
            </Column>
        </DataTable>
    </div>

    <div v-else-if="loading">{{ t('default.loading') }}</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { StaticColumns } from '@/types/operations/columns';
import { useStoreGenericTable } from '../../components/global/useStoreGenericTable'; // Temporary Store
import { useAlert } from '@/composables/useAlert';

const props = defineProps<{
    subpageTitle: string;
    store: Record<string, unknown>;
    storeItemsKey: string;
    fetchMethod: string;
    staticColumns: StaticColumns[];
    initialSort?: { field: string; direction: 1 | -1 };
    pageBase?: 0 | 1;
    header?: boolean;
    checkboxCol?: boolean;
    actionCol?: boolean;
    filters?: boolean;
}>();

if (props.storeItemsKey) (props.store as any).__tableItemsKey = props.storeItemsKey;
if (props.pageBase !== undefined) (props.store as any).__tablePageBase = Number(props.pageBase);

const { t } = useI18n();
const { error } = useAlert();

type Row = unknown;

const {
    data: tableData,
    totalRecords,
    loading,
    rowsPerPage,
    fetchData,
    onPage,
    handleSort
} = useStoreGenericTable<Row, typeof props.store>(
    props.store,
    props.fetchMethod,
    props.initialSort ?? { field: 'startTime', direction: -1 }
);

onMounted(async () => {
    loading.value = true;
    try {
        await fetchData();
    } catch {
        error(t('default.error'), t('default.errorMessage'));
    } finally {
        loading.value = false;
    }
});
</script>
