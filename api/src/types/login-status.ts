import { OpenTreasuryUser } from '../entities/open-treasury-user.js';

export enum LoginStatus {
    AUTHORIZED = 'OK',
    UNAUTHORIZED = 'UNAUTHORIZED',
}

export interface LoginStatusResponse {
    status: LoginStatus;
    user?: OpenTreasuryUser;
}
