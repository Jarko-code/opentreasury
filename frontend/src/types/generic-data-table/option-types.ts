import type { RouteValue } from '@/router/names';

export interface TableOptions<T> {
    columnVisibilityStorageKey?: string;
    newRecordRoute?: RouteValue;
    autoLoad?: boolean;
    showPagination?: boolean;
    showFilters?: boolean;
    defaultActions?: {
        editRoute?: (record: T) => void;
        onCopy?: (record: T) => Promise<void>;
        onDelete?: (record: T) => Promise<void>;
    };
    customActions?: Array<T>;
}
