import { OpenTreasuryEntity } from './open-treasury-entity.js';

export interface OpenTreasuryRole extends OpenTreasuryEntity {
    systemName: string;
    displayName: string;
    internal: boolean;
    validityInterval: unknown | null;
    attributeDescriptor: OpenTreasuryAttributeDescriptor;
}

export interface OpenTreasuryAttributeDescriptor {
    subclass: 'composite' | 'leaf';
    systemName: string;
    displayName: string;
    type?: string;
    required?: boolean;
    owningSystem?: string | null;
    path?: {
        elements: string[];
    };
    children?: OpenTreasuryAttributeDescriptor[];
}
