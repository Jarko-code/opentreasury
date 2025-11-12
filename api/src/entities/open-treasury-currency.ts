import { OpenTreasuryEntity } from './open-treasury-entity.js';

export interface OpenTreasuryCurrency extends OpenTreasuryEntity {
    code: string;
    name: string;
    kind: string | null;
    active: boolean;
}
