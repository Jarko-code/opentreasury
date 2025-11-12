import { OpenTreasuryEntity } from './open-treasury-entity.js';

export interface OpenTreasuryFile extends OpenTreasuryEntity {
    uploadTime: Date;
    mimeType: string;
    originalFilename: string;
}
