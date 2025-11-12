import type {
    PageRequest,
    PageResponse,
    Query,
    Sorting
} from '@opentreasury/opentreasury-service-api';
import type { DataTablePageEvent, DataTableSortEvent } from 'primevue';
import type { UiFetchQuery } from './data-source-types';
import type { Ref } from 'vue';

export interface GenericTableData<T> {
    fetchPage: (options: UiFetchQuery) => Promise<PageResponse<T>>;
    defaultQuery?: Query;
}

export interface TableResponse<T> {
    data: Ref<Array<T>>;
    loading: Ref<boolean>;
    totalRecords: Ref<number>;

    page: Ref<PageRequest>;
    sorting: Ref<Sorting | undefined>;
    query: Ref<Query | undefined>;

    isEmpty: Ref<boolean>;

    loadData: () => Promise<void>;
    onPage: (event: DataTablePageEvent) => void;
    onSort: (event: DataTableSortEvent) => void;
    setQuery: (newQuery: Query | undefined) => void;
    refresh: () => Promise<void>;
    reset: () => void;
}
