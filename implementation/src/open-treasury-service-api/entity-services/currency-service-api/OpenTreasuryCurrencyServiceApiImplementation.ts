import { OpenTreasuryCurrency } from '@opentreasury/opentreasury-service-api';
import { OpenTreasuryCurrencyServiceApi } from './OpenTreasuryCurrencyServiceApi.js';
import { BaseOpenTreasuryServiceApi } from '../BaseOpenTreasuryServiceApi.js';
import { ApiEntityService } from '../../../api-types.js';

class OpenTreasuryCurrencyServiceApiImplementation
    extends BaseOpenTreasuryServiceApi<OpenTreasuryCurrency>
    implements OpenTreasuryCurrencyServiceApi
{
    protected entityType = 'currency' as const;
    protected getApiService(): ApiEntityService {
        return this._api.CurrencyService.currencies;
    }
}

export { OpenTreasuryCurrencyServiceApiImplementation };
