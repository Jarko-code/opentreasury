import type {
    FilterCollection,
    OpenTreasuryObject,
    PageResponse,
    SortingCriteria
} from '@/types/service-layer/index';

export interface TableDataService<T extends OpenTreasuryObject> {
    fetchPage: (options: UiFetchQuery) => Promise<PageResponse<T>>;
    fetchAll: (sorting?: SortingCriteria) => Promise<T[]>;
    fetchById: (id: string) => Promise<T>;
    saveEntity: (entityToSave: T) => Promise<T>;
    deleteEntity: (id: string) => Promise<void>;
    defaultQuery?: FilterCollection;
}

export type UiFetchQuery = {
    query?: any; //TODO FIX
    page?: any; //TODO FIX
    sorting?: any; //TODO FIX
};

//query objekt  transformace na implementacni vrstve, jeste pozmenime predpokladam
