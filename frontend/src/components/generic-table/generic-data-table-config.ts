import type { DefaultTableActions, TableAction } from '@/types/generic-data-table/definition-types';
import { useRouter } from 'vue-router';

export const ROWS_PER_PAGE_OPTION = [10, 20, 30];

export const MAX_LOADING_SKELETON_ROWS = 10;
//todo zkusit jeste lepe tvorit ty akce
export function createDefaultActions<T>(config: DefaultTableActions<T>): Array<TableAction<T>> {
    const router = useRouter();

    const actions: Array<TableAction<T>> = [];

    if (config.editRoute) {
        actions.push({
            name: 'edit',
            icon: 'pi pi-pencil',
            severity: 'info',
            onClick: (record) => {
                //router.push(config.editRoute!(record));
                // dodt cestu
                console.log('kam jdes?');
            }
        });
    }

    if (config.onCopy) {
        actions.push({
            name: 'copy',
            icon: 'pi pi-copy',
            severity: 'secondary',
            onClick: async (record) => {
                try {
                    await config.onCopy!(record);
                    console.log('no nejaka notifka tady');
                } catch (error) {
                    console.log('no nejaka notifka tady', error);
                }
            }
        });
    }

    if (config.onDelete) {
        actions.push({
            name: 'delete',
            icon: 'pi pi-trash',
            severity: 'danger',
            onClick: async (record) => {
                await config.onDelete!(record);
                console.log('no tady taky notifka atd');
            }
        });
    }

    return actions;
}
