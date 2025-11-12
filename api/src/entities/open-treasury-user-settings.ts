import { OpenTreasuryEntity } from './open-treasury-entity.js';

export interface OpenTreasuryUserSettings extends OpenTreasuryEntity {
    username: string;
    cashFlowDecimalPlaces: string;
    defaultDecimalPlaces: string;
    defaultNumberFormat: string;
    defaultNumberSeparator: string;
    defaultThousandSeparator: string;
}
