import { ref, watch } from 'vue';
import type { PageEvent, FetchResult, FetchParams } from '../types/global';
import type { DataTableSortEvent } from 'primevue/datatable';
import { SearchQueryParameter } from '@livesystems/openplatform-client-ts';

export const usePaginatedTable = <T = any>(
    fetchFn: (params: FetchParams) => Promise<FetchResult<T>>,
    defaultSorting?: { field: string; direction: 1 | -1 }
) => {
    const data = ref<T[]>([]);
    const totalRecords = ref(0);
    const loading = ref(false);
    const currentPage = ref(0);
    const rowsPerPage = ref(10);
    const filters = ref<Record<string, SearchQueryParameter>>({});

    const sorting = ref(defaultSorting ? { ...defaultSorting } : undefined);

    const fetchData = async () => {
        loading.value = true;

        const params: FetchParams = {
            page: currentPage.value,
            size: rowsPerPage.value,
            filters: filters.value
        };

        if (sorting.value) {
            params.sorting = sorting.value;
        }

        const result = await fetchFn(params);

        data.value = result.items;
        totalRecords.value = result.total;

        loading.value = false;
    };

    const onPage = async (event: PageEvent) => {
        currentPage.value = event.page;
        rowsPerPage.value = event.rows;
        await fetchData();
    };

    const handleSort = async (event: DataTableSortEvent) => {
        if (typeof event.sortField === 'string' && event.sortOrder) {
            sorting.value = {
                field: event.sortField,
                direction: event.sortOrder as 1 | -1
            };
        } else {
            sorting.value = undefined;
        }
        await fetchData();
    };

    watch(
        filters,
        async () => {
            currentPage.value = 0;
            await fetchData();
        },
        { deep: true }
    );

    return {
        data,
        totalRecords,
        loading,
        currentPage,
        rowsPerPage,
        filters,
        sorting,
        fetchData,
        onPage,
        handleSort
    };
};
