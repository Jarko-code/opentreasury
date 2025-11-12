import { UserServiceApi } from './entities/user-service-api.js';
import { ScriptServiceApi } from './entities/script-service-api.js';
import { ObjectDefinitionServiceApi } from './entities/object-definition-service-api.js';
import { FileServiceApi } from './entities/file-service-api.js';
import { LoginStatus, LoginStatusResponse } from '../types/login-status.js';
import { UserSettingsServiceApi } from './entities/user-settings-service.js';
import { AccountServiceApi } from './entities/account-service-api.js';
import { CurrencyServiceApi } from './entities/currency-service-api.js';
import { ProcessServiceApi } from './entities/processes-service-api.js';
import { RoleServiceApi } from './entities/role-service-api.js';
import { ObjectServiceApi } from './entities/object-service-api.js';
import { FilterServiceApi } from './entities/filter-service-api.js';
import { ObjectLinkDefinitionServiceApi } from './entities/object-link-definition-service-api.js';
import { ObjectLinkServiceApi } from './entities/object-link-service-api.js';
import { SecurityGroupServiceApi } from './entities/security-group-service-api.js';

export interface ServiceApi {
    authorization: AuthorizationServiceApi;

    entityServices: ModuleServicesApi;
}

export interface AuthorizationServiceApi {
    login(username: string, password: string): Promise<LoginStatusResponse>;

    logout(): LoginStatus;

    tryAuthorization(): Promise<LoginStatusResponse>;

    isAuthenticated(): LoginStatus;

    setTokenExpirationCallback(callback: () => void): void;
}

export interface ModuleServicesApi {
    objectDefinitionService: ObjectDefinitionServiceApi;

    objectService: ObjectServiceApi;

    filterService: FilterServiceApi;

    objectLinkDefinitionService: ObjectLinkDefinitionServiceApi;

    objectLinkService: ObjectLinkServiceApi;

    userService: UserServiceApi;

    roleService: RoleServiceApi;

    securityGroupService: SecurityGroupServiceApi;

    scriptService: ScriptServiceApi;

    fileService: FileServiceApi;

    userSettingsService: UserSettingsServiceApi;

    accountService: AccountServiceApi;

    currencyService: CurrencyServiceApi;

    processService: ProcessServiceApi;
}
