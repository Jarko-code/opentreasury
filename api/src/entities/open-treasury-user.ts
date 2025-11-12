import { OpenTreasuryEntity } from './open-treasury-entity.js';

export interface OpenTreasuryUser extends OpenTreasuryEntity {
    username?: string;
    password?: string;
    email?: string;
    phoneNumber?: string;
    isBlocked: boolean;
    blockedReason?: string;
    roles: Array<string>;
}
