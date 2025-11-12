import { ref, computed } from 'vue';
import type { DataTablePageEvent, DataTableSortEvent } from 'primevue';
import type { PageRequest, Query, Sorting } from '@opentreasury/opentreasury-service-api';
import type {
    GenericTableData,
    TableResponse
} from '@/types/generic-data-table/generic-table-types';

export function useDataTable<T>(tableInput: GenericTableData<T>): TableResponse<T> {
    const data = ref<Array<T>>([]);
    const loading = ref(false);
    const totalRecords = ref(0);

    const page = ref<PageRequest>({
        page: 0,
        size: 20
    });

    const sorting = ref<Sorting | undefined>(undefined);
    const query = ref<Query | undefined>(tableInput.defaultQuery);

    const isEmpty = computed(() => data.value.length === 0 && !loading.value);

    async function loadData(): Promise<void> {
        loading.value = true;

        try {
            const response = await tableInput.fetchPage({
                query: query.value,
                page: page.value,
                sorting: sorting.value
            });

            data.value = response.content;
            totalRecords.value = response.pageInfo.totalCount;
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    }

    function onPage(event: DataTablePageEvent): void {
        page.value = {
            page: event.page ?? 0,
            size: event.rows
        };
        loadData();
    }

    function onSort(event: DataTableSortEvent): void {
        if (!event.sortField) {
            sorting.value = undefined;
        } else {
            sorting.value = {
                field: String(event.sortField),
                direction: (event.sortOrder ?? 1) as 1 | -1
            };
        }
        loadData();
    }

    function setQuery(newQuery: Query | undefined): void {
        query.value = newQuery;
        page.value.page = 0;
        loadData();
    }

    async function refresh(): Promise<void> {
        await loadData();
    }

    function reset(): void {
        page.value = { page: 0, size: 20 };
        sorting.value = undefined;
        query.value = tableInput.defaultQuery;
    }

    return {
        data,
        loading,
        totalRecords,

        page,
        sorting,
        query,

        isEmpty,

        loadData,
        onPage,
        onSort,
        setQuery,
        refresh,
        reset
    };
}
