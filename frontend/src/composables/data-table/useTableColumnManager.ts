import { ref } from 'vue';
import type {
    ColumnVisibilityOptions,
    ColumnVisibilityResponse,
    TableColumn
} from '@/types/generic-data-table/definition-types';

export function useTableColumnManager<T>(
    options: ColumnVisibilityOptions<T>
): ColumnVisibilityResponse<T> {
    const configurableColumns = options.columns.filter((column) => column.name !== 'actions');
    const actionsColumn = options.columns.find((column) => column.name === 'actions');

    const columnStates = ref<Record<string, boolean>>(
        configurableColumns.reduce(
            (acc, column) => {
                acc[column.name] = true;
                return acc;
            },
            {} as Record<string, boolean>
        )
    );

    const orderedColumns = ref<Array<TableColumn<T>>>([...configurableColumns]);
    const visibleColumns = ref<Array<TableColumn<T>>>([...options.columns]);
    const allColumnsVisible = ref(true);

    function updateVisibleColumns(): void {
        const visible = orderedColumns.value.filter((column) => columnStates.value[column.name]);

        visibleColumns.value = actionsColumn ? [actionsColumn, ...visible] : visible;

        allColumnsVisible.value = orderedColumns.value.every(
            (column) => columnStates.value[column.name]
        );
    }

    function toggleColumn(columnName: string, isVisible: boolean): void {
        if (columnName === 'actions') return;

        columnStates.value[columnName] = isVisible;
        updateVisibleColumns();
    }

    function toggleAllColumns(isVisible: boolean): void {
        orderedColumns.value.forEach((column) => {
            columnStates.value[column.name] = isVisible;
        });
        allColumnsVisible.value = isVisible;
        updateVisibleColumns();
    }

    function reorderColumns(newOrder: Array<TableColumn<T>>): void {
        orderedColumns.value = newOrder.filter((column) => column.name !== 'actions');
        updateVisibleColumns();
    }

    function resetColumns(): void {
        orderedColumns.value = [...configurableColumns];
        configurableColumns.forEach((column) => {
            columnStates.value[column.name] = true;
        });
        allColumnsVisible.value = true;
        updateVisibleColumns();
    }

    return {
        visibleColumns,
        orderedColumns,
        columnStates,
        allColumnsVisible,
        toggleColumn,
        toggleAllColumns,
        reorderColumns,
        resetColumns
    };
}
