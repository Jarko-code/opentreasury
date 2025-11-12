import type { Ref } from 'vue';

export type TableAction<T> = {
    name: string;
    icon?: string;
    severity?: string;
    label?: string;
    onClick: (data: T) => void | Promise<void>;
};

export type TableColumn<T> = {
    name: string;
    label: string;
    value: (data: T) => Promise<string> | string;
};

export interface DefaultTableActions<T> {
    editRoute?: (record: T) => string;
    onCopy?: (record: T) => Promise<void>;
    onDelete?: (record: T) => Promise<void>;
}

export interface ColumnVisibilityOptions<T> {
    columns: Array<TableColumn<T>>;
    storageKey?: string;
}

export type TableColumnManagerEmits<T> = {
    (e: 'toggle-column', columnName: string, isVisible: boolean): void;
    (e: 'toggle-all', isVisible: boolean): void;
    (e: 'reorder', newOrder: Array<TableColumn<T>>): void;
    (e: 'reset'): void;
};

export interface ColumnVisibilityResponse<T> {
    visibleColumns: Ref<Array<TableColumn<T>>>;
    orderedColumns: Ref<Array<TableColumn<T>>>;
    columnStates: Ref<Record<string, boolean>>;
    allColumnsVisible: Ref<boolean>;
    toggleColumn: (columnName: string, isVisible: boolean) => void;
    toggleAllColumns: (isVisible: boolean) => void;
    reorderColumns: (newOrder: Array<TableColumn<T>>) => void;
    resetColumns: () => void;
}
