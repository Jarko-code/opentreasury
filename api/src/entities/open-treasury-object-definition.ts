import { OpenTreasuryEntity } from './open-treasury-entity.js';
import { OpenTreasuryAcl } from '../types/open-treasury-acl.js';

export interface DynaPropertyDetails {
    required?: boolean;
    allowInvalid?: boolean;
    type: string;
    recalculationScript?: string;

    [key: string]: PropertyType | Array<PropertyType>;
}

export type PropertyType = string | number | boolean | Date;

export interface DynaProperty<T extends DynaPropertyDetails = DynaPropertyDetails> {
    name: string;
    displayName: string;
    details?: T;
}

export interface OpenTreasuryObjectDefinition extends OpenTreasuryEntity {
    code: string;
    name?: string;
    description?: string;
    applicationACL: Record<string, OpenTreasuryAcl>;
    model: {
        dynaProperties: Record<string, DynaProperty>;
    };
}
