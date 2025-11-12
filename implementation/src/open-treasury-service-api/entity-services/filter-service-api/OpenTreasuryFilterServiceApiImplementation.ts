import { SavedFilter } from '@opentreasury/opentreasury-service-api';
import { OpenTreasuryFilterServiceApi } from './OpenTreasuryFilterServiceApi.js';
import { BaseOpenTreasuryServiceApi } from '../BaseOpenTreasuryServiceApi.js';
import { ApiEntityService } from '../../../api-types.js';

class OpenTreasuryFilterServiceApiImplementation
    extends BaseOpenTreasuryServiceApi<SavedFilter>
    implements OpenTreasuryFilterServiceApi
{
    protected entityType = 'filter' as const;
    protected getApiService(): ApiEntityService {
        return this._api.OperationService.queries;
    }
}

export { OpenTreasuryFilterServiceApiImplementation };
