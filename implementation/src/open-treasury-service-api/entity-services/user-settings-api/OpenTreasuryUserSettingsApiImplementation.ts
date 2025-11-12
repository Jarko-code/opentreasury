import { OpenTreasuryUserSettingsApi } from './OpenTreasuryUserSettingsApi.js';
import { BaseOpenTreasuryServiceApi } from '../BaseOpenTreasuryServiceApi.js';
import { OpenTreasuryUserSettings } from '@opentreasury/opentreasury-service-api';

class UserSettingsServiceApiImplementation
    extends BaseOpenTreasuryServiceApi<OpenTreasuryUserSettings>
    implements OpenTreasuryUserSettingsApi
{
    protected entityType = 'userSettings' as const;
    getApiService() {
        return this._api.UserInterfaceService.preferences;
    }
}

export { UserSettingsServiceApiImplementation };
