import { ModuleServicesApi } from '@opentreasury/opentreasury-service-api';
import { OpenTreasuryAccountServiceApiImplementation } from './account-service-api/OpenTreasuryAccountServiceApiImplementation.js';
import { OpenTreasuryCurrencyServiceApiImplementation } from './currency-service-api/OpenTreasuryCurrencyServiceApiImplementation.js';
import { OpenTreasuryFileServiceApiImplementation } from './file-service-api/OpenTreasuryFileServiceApiImplementation.js';
import { OpenTreasuryFilterServiceApiImplementation } from './filter-service-api/OpenTreasuryFilterServiceApiImplementation.js';
import { OpenTreasuryObjectDefinitionServiceApiImplementation } from './object-definition-service-api/OpenTreasuryObjectDefinitionsServiceApiImplementation.js';
import { OpenTreasuryObjectLinkDefinitionServiceApiImplementation } from './object-link-definition-service-api/OpenTreasuryObjectLinkDefinitionServiceApiImplementation.js';
import { OpenTreasuryObjectLinkServiceApiImplementation } from './object-link-service-api/OpenTreasuryObjectLinkServiceApiImplementation.js';
import { OpenTreasuryObjectServiceApiImplementation } from './object-service-api/OpenTreasuryObjectServiceApiImplementation.js';
import { OpenTreasuryProcessServiceApiImplementation } from './processes-service-api/OpenTreasuryProcessesServiceApiImplementation.js';
import { OpenTreasuryRoleServiceApiImplementation } from './role-service-api/OpenTreasuryRoleServiceApiImplementation.js';
import { OpenTreasuryScriptServiceApiImplementation } from './script-service-api/OpenTreasuryScriptServiceApiImplementation.js';
import { OpenTreasurySecurityGroupServiceApiImplementation } from './security-group-service-api/OpenTreasurySecurityGroupServiceApiImplementation.js';
import { OpenTreasuryUserServiceApiImplementation } from './user-service-api/OpenTreasuryUserServiceApiImplementation.js';
import { UserSettingsServiceApiImplementation } from './user-settings-api/OpenTreasuryUserSettingsApiImplementation.js';
import { ApiOpenPlatformApi } from '../../api-types.js';

export class EntityServices implements ModuleServicesApi {
    constructor(private readonly api: ApiOpenPlatformApi) {}

    readonly accountService = new OpenTreasuryAccountServiceApiImplementation(this.api);
    readonly currencyService = new OpenTreasuryCurrencyServiceApiImplementation(this.api);
    readonly fileService = new OpenTreasuryFileServiceApiImplementation(this.api);
    readonly filterService = new OpenTreasuryFilterServiceApiImplementation(this.api);
    readonly objectDefinitionService = new OpenTreasuryObjectDefinitionServiceApiImplementation(this.api);
    readonly objectLinkDefinitionService = new OpenTreasuryObjectLinkDefinitionServiceApiImplementation(this.api);
    readonly objectLinkService = new OpenTreasuryObjectLinkServiceApiImplementation(this.api);
    readonly objectService = new OpenTreasuryObjectServiceApiImplementation(this.api);
    readonly processService = new OpenTreasuryProcessServiceApiImplementation(this.api);
    readonly roleService = new OpenTreasuryRoleServiceApiImplementation(this.api);
    readonly scriptService = new OpenTreasuryScriptServiceApiImplementation(this.api);
    readonly securityGroupService = new OpenTreasurySecurityGroupServiceApiImplementation(this.api);
    readonly userService = new OpenTreasuryUserServiceApiImplementation(this.api);
    readonly userSettingsService = new UserSettingsServiceApiImplementation(this.api);
}
