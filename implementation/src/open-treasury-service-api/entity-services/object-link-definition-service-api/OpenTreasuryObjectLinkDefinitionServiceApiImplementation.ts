import { ObjectLinkDefinition } from '@opentreasury/opentreasury-service-api';
import { OpenTreasuryObjectLinkDefinitionServiceApi } from './OpenTreasuryObjectLinkDefinitionServiceApi.js';
import { BaseOpenTreasuryServiceApi } from '../BaseOpenTreasuryServiceApi.js';
import { ApiEntityService } from '../../../api-types.js';

class OpenTreasuryObjectLinkDefinitionServiceApiImplementation
    extends BaseOpenTreasuryServiceApi<ObjectLinkDefinition>
    implements OpenTreasuryObjectLinkDefinitionServiceApi
{
    protected entityType = 'objectLinkDefinition' as const;
    protected getApiService(): ApiEntityService {
        return this._api.OperationService.operationDefinitionLinks;
    }
    // tu mame dva rozne ednpointy pre linky - zjednotime to na jeden alebo budu dva endpointy?
    // async saveOperationLinkDefinition<T extends OperationLinkDefinition>(definition: T): Promise<T> {
    //         try {
    //             const saved = (await this._operationService.operationLinks.save(definition)) as unknown as T;

    //             if (!saved) {
    //                 throw new OPSError(`Failed to save operation link definition.`);
    //             }

    //             return saved;
    //         } catch (err: any) {
    //             throw new OPSError(`Failed to save operation link definition: ${err.message}`);
    //         }
    //     }
}

export { OpenTreasuryObjectLinkDefinitionServiceApiImplementation };
