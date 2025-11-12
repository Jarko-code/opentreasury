import { OpenTreasurySecurityGroup } from '@opentreasury/opentreasury-service-api';
import { OpenTreasurySecurityGroupServiceApi } from './OpenTreasurySecurityGroupServiceApi.js';
import { BaseOpenTreasuryServiceApi } from '../BaseOpenTreasuryServiceApi.js';
import { ApiEntityService } from '../../../api-types.js';

class OpenTreasurySecurityGroupServiceApiImplementation
    extends BaseOpenTreasuryServiceApi<OpenTreasurySecurityGroup>
    implements OpenTreasurySecurityGroupServiceApi
{
    protected entityType = 'securityGroup' as const;
    protected getApiService(): ApiEntityService {
        return this._api.AuthorizationService.securityGroups;
    }
}

export { OpenTreasurySecurityGroupServiceApiImplementation };
