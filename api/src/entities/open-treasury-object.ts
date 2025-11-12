import { Nullable } from '../utils/utils.js';
import { OpenTreasuryAcl } from '../types/open-treasury-acl.js';
import { OpenTreasuryEntity } from './open-treasury-entity.js';

export interface OpenTreasuryObject extends OpenTreasuryEntity {
    creator?: Nullable<string>;
    updatedBy?: Nullable<string>;
    createdTimestamp?: Nullable<Date>;
    updatedTimestamp?: Nullable<Date>;
    operationDefinition?: Nullable<string>;
    securityGroup?: Nullable<string>;
    userApplicationACL?: Record<string, OpenTreasuryAcl>;
    roleApplicationACL?: Record<string, OpenTreasuryAcl>;
    source?: string;
    name?: string | null;
    actualStatus?: string;
    active?: boolean;
    base?: string;
}
