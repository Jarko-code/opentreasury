import type {
    OpenTreasuryEntity,
    OpenTreasuryEntityServiceApi,
    PageRequest
} from '@/types/service-layer/index';
import type { TableDataService } from '@/types/generic-data-table/data-source-types';

export function entityServiceGenerator<T extends OpenTreasuryEntity>(
    service: OpenTreasuryEntityServiceApi<T>
): TableDataService<T> {
    return {
        fetchPage(options?) {
            const {
                query: tableFilter,
                page: tablePagination,
                sorting: tableSorting
            } = options ?? {};

            const pageRequest = {
                filters: tableFilter,
                pagination: tablePagination,
                sorting: tableSorting
            } as PageRequest;

            return service.fetchPage(pageRequest);
        },
        fetchAll(sorting?) {
            return service.fetchAll(sorting);
        },
        fetchById: (id: string) => service.fetchById(id),
        saveEntity: (entityToSave: T) => service.saveEntity(entityToSave),
        deleteEntity: (id: string) => service.deleteEntity(id)
    };
}
