import { SavedFilter } from '../../entities/open-treasury-filter.js';
import { OpenTreasuryEntityServiceApi } from '../open-treasury-entity-service-api.js';

export interface FilterServiceApi extends OpenTreasuryEntityServiceApi<SavedFilter> {}
