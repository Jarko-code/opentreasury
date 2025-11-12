import { AuthorizationServiceApi } from '@opentreasury/opentreasury-service-api';
import { OpenTreasuryUserServiceApi } from '../entity-services/user-service-api/OpenTreasuryUserServiceApi.js';

export interface OpenTreasuryAuthorizationServiceApi extends AuthorizationServiceApi {
    setUserService(userService: OpenTreasuryUserServiceApi): void;
}
