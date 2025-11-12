<!--
<template>
    <div v-if="processes">
        <SubpageTitle :title="t('processes.title')" />
        <DataTable
            :value="processesData"
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
            sortMode="single"
        >
            <Column
                v-for="col in staticProcessesColumns"
                :key="col.name"
                :field="col.name"
                :header="col.displayName"
                style="width: auto"
                sortable
            >
                <template #body="{ data }">
                    &lt;!&ndash; Shortened ID &ndash;&gt;
                    <span v-if="col.name === 'id'">
                        {{ shortId(data[col.name]) }}
                    </span>
                    &lt;!&ndash; Progress value to percentage &ndash;&gt;
                    <span v-else-if="col.name === 'progress'">
                        {{ toPercentage(data[col.name], 0) }}
                    </span>
                    &lt;!&ndash; UserName by ID &ndash;&gt;
                    <span v-else-if="col.name === 'startedBy'">
                        {{ findUserNameById(data[col.name]) }}
                    </span>
                    <span v-else :style="col.name === 'lastMessage' && 'white-space: normal'">
                        {{ col.format ? col.format(data[col.name]) : data[col.name] }}
                    </span>
                </template>
            </Column>
        </DataTable>
    </div>

    <div v-else-if="loading">{{ t('default.loading') }}</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useAlert } from '@/composables/useAlert';
import { useProcessesColumns } from '@/composables/processing/useProcessesColumns';
import { useProcessesStore } from '@/stores/useProcessesStore';
import { usePaginatedTable } from '@/composables/usePaginatedTable';
import type { FetchParams, FetchResult } from '@/types/global';
import { shortId } from '@/helpers/shortId';
import { findUserNameById } from '@/composables/useNameById';

const { t } = useI18n();
const { error } = useAlert();
const processesStore = useProcessesStore();
const { processes } = storeToRefs(processesStore);
const { staticProcessesColumns } = useProcessesColumns();

const {
    data: processesData,
    totalRecords,
    loading,
    rowsPerPage,
    fetchData,
    onPage,
    handleSort
} = usePaginatedTable(
    async (params: FetchParams): Promise<FetchResult> => {
        const response = await processesStore.fetchAllProcesses(
            params.page,
            params.size,
            //@ts-ignore
            params.sorting
        );
        return {
            items: response.content,
            total: response.total
        };
    },
    { field: 'startTime', direction: -1 }
);

const toPercentage = (value: number, digits: number) => {
    return (value * 100).toFixed(digits) + '%';
};

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
-->
