import { OpenTreasuryUser } from '../../entities/open-treasury-user.js';
import { OpenTreasuryEntityServiceApi } from '../open-treasury-entity-service-api.js';

export interface UserServiceApi extends OpenTreasuryEntityServiceApi<OpenTreasuryUser> {}
