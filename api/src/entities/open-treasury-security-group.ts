import { OpenTreasuryEntity } from './open-treasury-entity.js';

export interface OpenTreasurySecurityGroup extends OpenTreasuryEntity {
    name: string;
    description?: string;
}
