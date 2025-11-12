import { OpenTreasuryObjectDefinitionServiceApi } from './OpenTreasuryObjectDefinitionsServiceApi.js';
import { BaseOpenTreasuryServiceApi } from '../BaseOpenTreasuryServiceApi.js';
import { OpenTreasuryObjectDefinition } from '@opentreasury/opentreasury-service-api';
import { ApiEntityService } from '../../../api-types.js';

class OpenTreasuryObjectDefinitionServiceApiImplementation
    extends BaseOpenTreasuryServiceApi<OpenTreasuryObjectDefinition>
    implements OpenTreasuryObjectDefinitionServiceApi
{
    protected entityType = 'objectDefinition' as const;
    protected getApiService(): ApiEntityService {
        return this._api.OperationService.operationDefinitions;
    }
}

export { OpenTreasuryObjectDefinitionServiceApiImplementation };
