import { OpenTreasuryEntity } from './open-treasury-entity.js';
import { PropertyType } from './open-treasury-object-definition.js';

export interface SavedFilter extends OpenTreasuryEntity {
    name: string;
    object: string;
    parameters: Record<
        string,
        {
            type: string;
            operator: string;
            value: PropertyType;
            negation?: boolean;
        }
    >;
    createdAt?: string;
    updatedAt?: string;
}
