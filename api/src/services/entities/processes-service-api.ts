import { OpenTreasuryProcesses } from '../../entities/open-treasury-processes.js';
import { OpenTreasuryEntityServiceApi } from '../open-treasury-entity-service-api.js';

export interface ProcessServiceApi extends OpenTreasuryEntityServiceApi<OpenTreasuryProcesses> {}
