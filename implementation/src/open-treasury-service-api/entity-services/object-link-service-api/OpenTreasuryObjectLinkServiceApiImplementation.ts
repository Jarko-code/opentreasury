import { ObjectLink } from '@opentreasury/opentreasury-service-api';
import { OpenTreasuryObjectLinkServiceApi } from './OpenTreasuryObjectLinkServiceApi.js';
import { BaseOpenTreasuryServiceApi } from '../BaseOpenTreasuryServiceApi.js';
import OPSError from '../../../utils/ServiceRepository/OPSError.js';
import { ApiEntityService, ApiPageRequest } from '../../../api-types.js';

class OpenTreasuryObjectLinkServiceApiImplementation
    extends BaseOpenTreasuryServiceApi<ObjectLink>
    implements OpenTreasuryObjectLinkServiceApi
{
    protected entityType = 'objectLink' as const;
    protected getApiService(): ApiEntityService {
        return this._api.OperationService.operationLinks;
    }

    async fetchByOperationId<T extends ObjectLink>(operationId: string): Promise<Array<T>> {
        try {
            const searchQuery: any = {
                parameters: {
                    secondarySide: {
                        operator: 'eq',
                        type: 'string',
                        value: operationId,
                    },
                },
            };

            const pageRequest = new ApiPageRequest(0, 5000);

            const result = await this._api.OperationService.operationLinks.getAll(searchQuery, pageRequest);

            const content = (Array.isArray(result) ? result : (result?.content ?? [])) as Array<T>;

            return content;
        } catch (error: any) {
            console.error(`Failed to fetch operation links for operationId ${operationId}:`, error);
            throw new OPSError(`Failed to fetch operation links for operationId ${operationId}.`);
        }
    }

    async fetchByLinkDefinitionId<T extends ObjectLink>(linkDefinitionId: string): Promise<Array<T>> {
        try {
            const searchQuery: any = {
                parameters: {
                    linkDefinition: {
                        operator: 'eq',
                        type: 'string',
                        value: linkDefinitionId,
                    },
                },
            };

            const pageRequest = new ApiPageRequest(0, 5000);

            const result = await this._api.OperationService.operationLinks.getAll(searchQuery, pageRequest);

            const content = (Array.isArray(result) ? result : (result?.content ?? [])) as Array<T>;

            return content;
        } catch (error: any) {
            console.error(`Failed to fetch operation links for linkDefinitionId ${linkDefinitionId}:`, error);
            throw new OPSError(`Failed to fetch operation links for linkDefinitionId ${linkDefinitionId}.`);
        }
    }
}

export { OpenTreasuryObjectLinkServiceApiImplementation };
