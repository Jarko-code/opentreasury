<script setup lang="ts" generic="T">
import { Column } from 'primevue';
import type { TableColumn } from '@/types/generic-data-table/definition-types';
import type { TableOptions } from '@/types/generic-data-table/option-types';
import ActionColumn from './ActionColumn.vue';
import { useTableActions } from '@/composables/data-table/useTableActions';
import { computed } from 'vue';

const props = defineProps<{
    column: TableColumn<T>;
    options?: TableOptions<T>;
    loading: boolean;
}>();

function generateSkeletonWidth(): string {
    const widths = ['70%', '80%', '90%', '100%'];
    return widths[Math.floor(Math.random() * widths.length)];
}

const { actions, isActionColumn: checkIsActionColumn } = useTableActions([], props.options);

const isActionColumn = computed(() => checkIsActionColumn(props.column));

const showFilter = computed(() => props.options?.showFilters);
</script>

<template>
    <Column
        :field="column.name"
        :header="column.label"
        :showFilterMenu="false"
        :filterField="column.name"
        sortable
    >
        <template #body="{ data }">
            <Skeleton v-if="loading" height="1.2rem" :width="generateSkeletonWidth()" />
            <ActionColumn v-else-if="isActionColumn && actions" :record="data" :actions="actions" />
            <span v-else>
                {{ data[column.name] }}
            </span>
        </template>
        <!-- <template #filter="{ filterModel, filterCallback }" v-if="showFilter">
            <ColumnFilter
                :column="column"
                :filter-model="filterModel"
                :filter-callback="filterCallback"
            />
        </template> -->
    </Column>
</template>
