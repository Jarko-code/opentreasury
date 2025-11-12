import { OpenTreasuryAccount } from '../../entities/open-treasury-accounts.js';
import { OpenTreasuryEntityServiceApi } from '../open-treasury-entity-service-api.js';

export interface AccountServiceApi extends OpenTreasuryEntityServiceApi<OpenTreasuryAccount> {}
