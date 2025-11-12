import { OpenTreasuryEntity } from './open-treasury-entity.js';

export interface ObjectLink extends OpenTreasuryEntity {
    linkDefinition: string;
    primarySide: string;
    secondarySide: string;
}
