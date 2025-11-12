import { ACCOUNT_FIELD_TYPES } from './account-service';

export const ENTITY_FIELD_TYPE_MAP = {
    account: ACCOUNT_FIELD_TYPES,
    currency: ACCOUNT_FIELD_TYPES,
    file: ACCOUNT_FIELD_TYPES,
    filter: ACCOUNT_FIELD_TYPES,
    objectDefinition: ACCOUNT_FIELD_TYPES,
    objectLinkDefinition: ACCOUNT_FIELD_TYPES,
    objectLink: ACCOUNT_FIELD_TYPES,
    object: ACCOUNT_FIELD_TYPES,
    process: ACCOUNT_FIELD_TYPES,
    role: ACCOUNT_FIELD_TYPES,
    script: ACCOUNT_FIELD_TYPES,
    securityGroup: ACCOUNT_FIELD_TYPES,
    user: ACCOUNT_FIELD_TYPES,
    userSettings: ACCOUNT_FIELD_TYPES,
} as const;
