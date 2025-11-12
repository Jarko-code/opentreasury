import { OpenTreasuryUserServiceApi } from './OpenTreasuryUserServiceApi.js';
import { BaseOpenTreasuryServiceApi } from '../BaseOpenTreasuryServiceApi.js';
import { OpenTreasuryUser } from '@opentreasury/opentreasury-service-api';
import { ApiEntityService } from '../../../api-types.js';

class OpenTreasuryUserServiceApiImplementation
    extends BaseOpenTreasuryServiceApi<OpenTreasuryUser>
    implements OpenTreasuryUserServiceApi
{
    protected entityType = 'user' as const;
    protected getApiService(): ApiEntityService {
        return this._api.AuthorizationService.users;
    }
}

export { OpenTreasuryUserServiceApiImplementation };
