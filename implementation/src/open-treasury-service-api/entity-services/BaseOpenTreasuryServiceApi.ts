import {
    OpenTreasuryEntityServiceApi,
    OpenTreasuryObject,
    PageResponse,
    PageRequest,
    SortingCriteria,
} from '@opentreasury/opentreasury-service-api';
import { ApiEntityService, ApiOpenPlatformApi, ApiPageRequest, ApiSearchQuery } from '../../api-types.js';
import { getPageInfo } from '../../utils/utils.js';
import { FilterQueryTransformer } from '../../utils/SearchQueryUtils/filter-query-transformer.js';
import OPSError from '../../utils/ServiceRepository/OPSError.js';
import { convertApiValues } from '../../utils/convert-api-values.js';
import { ENTITY_FIELD_TYPE_MAP } from '../../types/service-type-registry.js';

const DEFAULT_PAGE_INDEX = 0;

export abstract class BaseOpenTreasuryServiceApi<T extends OpenTreasuryObject> implements OpenTreasuryEntityServiceApi<T> {
    protected abstract getApiService(): ApiEntityService;
    protected abstract entityType: keyof typeof ENTITY_FIELD_TYPE_MAP;

    protected _api: ApiOpenPlatformApi;

    constructor(api: ApiOpenPlatformApi) {
        this._api = api;
    }

    async fetchAll(sorting?: SortingCriteria): Promise<T[]> {
        return (
            await this.getApiService().getAll(
                new ApiSearchQuery(),
                {
                    page: 0,
                    pageSize: 10000000,
                },
                sorting,
            )
        )?.content as unknown as Array<T>;
    }

    async fetchPage(options: PageRequest): Promise<PageResponse<T>> {
        const { filters, pagination, sorting } = options;

        const apiQuery = FilterQueryTransformer.transform(filters);
        const pageQuery = new ApiPageRequest(pagination?.page ?? DEFAULT_PAGE_INDEX, pagination?.pageSize);

        const response = await this.getApiService().getAll(apiQuery, pageQuery, sorting);

        const fieldTypes = ENTITY_FIELD_TYPE_MAP[this.entityType];
        const content = convertApiValues(response.content, fieldTypes);

        return {
            // Very expensive
            content: content as unknown as Array<T>,
            pageInfo: getPageInfo(response),
        };
    }

    async fetchById(id: string): Promise<T> {
        if (!id) {
            throw new OPSError(`Invalid ID for fetch: ${id}`);
        }

        try {
            const response = await this.getApiService().get(id);

            if (!response) {
                throw new OPSError(`Entity with ID ${id} not found.`);
            }

            return response as unknown as T;
        } catch (error: any) {
            throw new OPSError(`Failed to fetch entity with id=${id}`);
        }
    }

    async saveEntity(entityToSave: T): Promise<T> {
        try {
            const response = await this.getApiService().save(entityToSave);

            if (!response) {
                throw new OPSError('Save operation returned empty response.');
            }

            const details = (response as any)?.details;

            if (details && typeof details === 'object') {
                return details as T;
            }

            return response as unknown as T;
        } catch (error) {
            throw new OPSError('Failed to save entity.', { cause: error });
        }
    }

    async deleteEntity(id: string): Promise<void> {
        if (!id) {
            throw new OPSError(`Invalid ID for deletion: ${id}`);
        }

        try {
            await this.getApiService().delete({ id });
        } catch (error: any) {
            throw new OPSError(`Failed to delete entity with id=${id}`);
        }
    }
}
