import type { TableQuery } from '@/types/operations/filters.ts';
import type { UiSorting } from '@opentreasury/opentreasury-service-api';

export interface FetchParams {
    page: number;
    size: number;
    filters?: TableQuery;
    sorting?: UiSorting;
    globalFilter?: string;
}

export interface SortEvent {
    sortField: string;
    sortOrder: number;
}

export interface PageEvent {
    page: number;
    rows: number;
}

export interface FetchResult<T = any> {
    items: T[];
    total: number;
}
