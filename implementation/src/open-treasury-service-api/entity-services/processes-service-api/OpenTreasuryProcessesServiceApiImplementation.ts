import { OpenTreasuryProcesses } from '@opentreasury/opentreasury-service-api';
import { OpenTreasuryProcessesServiceApi } from './OpenTreasuryProcessesServiceApi.js';
import { BaseOpenTreasuryServiceApi } from '../BaseOpenTreasuryServiceApi.js';
import { ApiEntityService } from '../../../api-types.js';

class OpenTreasuryProcessServiceApiImplementation
    extends BaseOpenTreasuryServiceApi<OpenTreasuryProcesses>
    implements OpenTreasuryProcessesServiceApi
{
    protected entityType = 'process' as const;
    protected getApiService(): ApiEntityService {
        return this._api.ProcessingService.processes;
    }
}

export { OpenTreasuryProcessServiceApiImplementation };
