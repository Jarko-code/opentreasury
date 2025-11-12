import { OpenTreasuryEntity } from './open-treasury-entity.js';

export interface ObjectLinkDefinition extends OpenTreasuryEntity {
    name: string;
    primaryOperationDefinitions: string[];
    primarySideName: string;
    secondaryOperationDefinitions: string[];
    secondarySideName: string;
    cardinality?: 'N/A' | 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE';
    cascadeDelete?: boolean;
    required?: boolean;
}
