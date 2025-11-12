<script setup lang="ts" generic="T extends OpenTreasuryObject">
import { computed, onMounted, ref } from 'vue';
import { useDataTable } from '@/composables/data-table/useDataTable';
import { DataTable } from 'primevue';
import type { TableColumn } from '@/types/generic-data-table/definition-types';
import type { TableDataService } from '@/types/generic-data-table/data-source-types';
import type { TableOptions } from '@/types/generic-data-table/option-types';
import { MAX_LOADING_SKELETON_ROWS, ROWS_PER_PAGE_OPTION } from './generic-data-table-config';
import TableSettingsPanel from './header/table-settings-panel/TableSettingsPanel.vue';
import GenericDataTableColumn from './column/GenericDataTableColumn.vue';
import { useTableActions } from '@/composables/data-table/useTableActions';
import type { OpenTreasuryObject } from '@opentreasury/opentreasury-service-api';

const props = defineProps<{
    definition: Array<TableColumn<T>>;
    dataSource: TableDataService<T>;
    options?: TableOptions<T>;
}>();

const defaultOptions = computed<TableOptions<T>>(() => ({
    showPagination: true,
    showFilters: true,
    autoLoad: true,
    ...props.options
}));

const table = useDataTable<T>({
    fetchPage: props.dataSource.fetchPage,
    defaultQuery: props.dataSource.defaultQuery
});

const { columnsWithActions } = useTableActions(props.definition, props.options);

const visibleColumns = ref<Array<TableColumn<T>>>([...columnsWithActions.value]);

const placeholderRows = computed(() =>
    Array.from({ length: MAX_LOADING_SKELETON_ROWS }, () => ({}))
);

const displayedData = computed(() =>
    table.loading.value ? placeholderRows.value : table.data.value
);

defineExpose({
    refresh: table.refresh,
    reset: table.reset,
    setQuery: table.setQuery,
    loadData: table.loadData
});

onMounted(() => {
    if (props.options?.autoLoad ?? true) {
        table.loadData();
    }
});
</script>

<template>
    <DataTable
        :value="displayedData"
        selectionMode="multiple"
        dataKey="id"
        scrollable
        resizableColumns
        columnResizeMode="expand"
        lazy
        size="small"
        :paginator="defaultOptions.showPagination"
        :filter-display="defaultOptions.showFilters ? 'menu' : undefined"
        :rows="table.page.value.size"
        :totalRecords="table.totalRecords.value"
        :rowsPerPageOptions="ROWS_PER_PAGE_OPTION"
        :sortField="table.sorting.value?.field"
        :sortOrder="table.sorting.value?.direction"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="{first} - {last} / {totalRecords}"
        @page="table.onPage"
        @sort="table.onSort"
    >
        <template #header>
            <div class="flex items-center justify-between">
                <new-record :route="defaultOptions.newRecordRoute" />

                <table-settings-panel
                    :columns="columnsWithActions"
                    :storage-key="defaultOptions.columnVisibilityStorageKey"
                    @update-columns="visibleColumns = $event"
                />
            </div>
        </template>
        <template #empty>
            {{ table.isEmpty ? 'Nebyl nalezen žádný záznam' : '' }}
        </template>
        <generic-data-table-column
            v-for="column in visibleColumns"
            :key="column.name"
            :column="column"
            :loading="table.loading.value"
            :options="defaultOptions"
        />
    </DataTable>
</template>
