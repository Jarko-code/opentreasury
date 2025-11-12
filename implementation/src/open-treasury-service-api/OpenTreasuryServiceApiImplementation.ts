import { OpenTreasuryServiceApi } from './OpenTreasuryServiceApi.js';
import { OpenTreasuryAuthorizationServiceApiImplementation } from './authorization-service/authorization-service-api-implementation.js';
import { EntityServices } from './entity-services/EntityServices.js';
import { OpenTreasuryAuthorizationServiceApi } from './authorization-service/authorization-service-api.js';
import { ModuleServicesApi } from '@opentreasury/opentreasury-service-api';
import { ApiOpenPlatformApi } from '../api-types.js';

class OpenTreasuryServiceApiImplementation implements OpenTreasuryServiceApi {
    private readonly _openPlatformApi: ApiOpenPlatformApi;

    constructor(api: string) {
        this._openPlatformApi = new ApiOpenPlatformApi({
            baseUrl: api,
        });

        this.entityServices = new EntityServices(this._openPlatformApi);
        this.authorization = new OpenTreasuryAuthorizationServiceApiImplementation(this._openPlatformApi);
        this.authorization.setUserService(this.entityServices.userService);
    }

    authorization: OpenTreasuryAuthorizationServiceApi;
    entityServices: ModuleServicesApi;
}

export { OpenTreasuryServiceApiImplementation };
