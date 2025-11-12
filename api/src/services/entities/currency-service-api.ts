import { OpenTreasuryCurrency } from '../../entities/open-treasury-currency.js';
import { OpenTreasuryEntityServiceApi } from '../open-treasury-entity-service-api.js';

export interface CurrencyServiceApi extends OpenTreasuryEntityServiceApi<OpenTreasuryCurrency> {}
