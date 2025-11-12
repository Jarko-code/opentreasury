import { OpenTreasuryEntity } from './open-treasury-entity.js';

export interface OpenTreasuryAccount extends OpenTreasuryEntity {
    name: string;
    alias?: string | null;
    accountNumber?: string | null;
    eBankingAccountNumber?: string | null;
    iban?: string | null;
    bankId?: string | null;
    currency?: string | null;
    type?: string | null;
    active?: boolean;
    activeFrom?: Date;
    activeThru?: Date;
    overdraftLimit?: number | null;
    geoPoint?: string | null;
    internal?: boolean;
    vizColor?: string | null;
    securityGroup?: string;
}
