import { OpenTreasuryAccount } from '@opentreasury/opentreasury-service-api';
import { OpenTreasuryAccountServiceApi } from './OpenTreasuryAccountServiceApi.js';
import { BaseOpenTreasuryServiceApi } from '../BaseOpenTreasuryServiceApi.js';
import { ApiEntityService } from '../../../api-types.js';

class OpenTreasuryAccountServiceApiImplementation
    extends BaseOpenTreasuryServiceApi<OpenTreasuryAccount>
    implements OpenTreasuryAccountServiceApi
{
    protected entityType = 'account' as const;
    protected getApiService(): ApiEntityService {
        return this._api.AccountService.accounts;
    }
}

export { OpenTreasuryAccountServiceApiImplementation };
