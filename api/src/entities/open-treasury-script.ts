import { OpenTreasuryEntity } from './open-treasury-entity.js';

export interface OpenTreasuryScript extends OpenTreasuryEntity {
    name: string;
    displayName?: string;
    description?: string;
    icon?: string;

    type: 'EVENT_TRIGGER' | 'MANUAL' | string;
    triggerObjectType?: 'operation' | 'account' | 'other' | string;
    triggerActionTypes?: string[];
    operationDefinitions?: string[];
}
