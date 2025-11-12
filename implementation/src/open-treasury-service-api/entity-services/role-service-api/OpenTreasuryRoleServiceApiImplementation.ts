import { OpenTreasuryRole } from '@opentreasury/opentreasury-service-api';
import { OpenTreasuryRoleServiceApi } from './OpenTreasuryRoleServiceApi.js';
import { BaseOpenTreasuryServiceApi } from '../BaseOpenTreasuryServiceApi.js';
import { ApiEntityService } from '../../../api-types.js';

class OpenTreasuryRoleServiceApiImplementation
    extends BaseOpenTreasuryServiceApi<OpenTreasuryRole>
    implements OpenTreasuryRoleServiceApi
{
    protected entityType = 'role' as const;
    protected getApiService(): ApiEntityService {
        return this._api.AuthorizationService.applicationRoles;
    }
}

export { OpenTreasuryRoleServiceApiImplementation };
