import { PageRequest, SortingCriteria } from '../types/page-request.js';
import { OpenTreasuryObject } from '../entities/open-treasury-object.js';
import { PageResponse } from '../types/page-response.js';

export interface OpenTreasuryEntityServiceApi<T extends OpenTreasuryObject> {
    fetchAll(sorting?: SortingCriteria): Promise<T[]>;

    fetchPage(options: PageRequest): Promise<PageResponse<T>>;

    fetchById(id: string): Promise<T>;

    saveEntity(entityToSave: T): Promise<T>;

    deleteEntity(id: string): Promise<void>;
}
