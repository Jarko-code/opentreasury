import { computed } from 'vue';
import type { TableColumn, TableAction } from '@/types/generic-data-table/definition-types';
import type { TableOptions } from '@/types/generic-data-table/option-types';
import { createDefaultActions } from '../../components/generic-table/generic-data-table-config';

export function useTableActions<T>(columns: Array<TableColumn<T>>, options?: TableOptions<T>) {
    const hasActions = computed(() => {
        const hasDefaultActions = options?.defaultActions !== undefined;
        const hasCustomActions = options?.customActions && options.customActions.length > 0;
        return hasDefaultActions || hasCustomActions;
    });

    const actionsColumn = computed<TableColumn<T> | undefined>(() => {
        if (!hasActions.value) return undefined;

        return {
            name: 'actions',
            label: 'Akce'
        } as TableColumn<T>;
    });

    const columnsWithActions = computed(() => {
        if (!hasActions.value) return columns;
        return [actionsColumn.value!, ...columns];
    });

    const actions = computed<Array<TableAction<T>>>(() => {
        if (!hasActions.value) return [];

        const defaultActions = options?.defaultActions
            ? createDefaultActions(options.defaultActions)
            : [];
        const customActions = options?.customActions || [];
        return [...defaultActions, ...customActions];
    });

    function isActionColumn(column: TableColumn<T>): boolean {
        return column.name === 'actions'; //toto asi lepe ale my bain uz hurts
    }

    return {
        columnsWithActions,
        actions,
        isActionColumn
    };
}
