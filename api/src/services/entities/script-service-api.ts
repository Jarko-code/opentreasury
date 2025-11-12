import { OpenTreasuryScript } from '../../entities/open-treasury-script.js';
import { OpenTreasuryEntityServiceApi } from '../open-treasury-entity-service-api.js';
import { PropertyType } from '../../entities/open-treasury-object-definition.js';

export interface ScriptServiceApi extends OpenTreasuryEntityServiceApi<OpenTreasuryScript> {
    //TODO script result
    run(scriptId: string, values: Record<string, PropertyType>): Promise<Record<string, unknown>>;

    runSync(scriptId: string, values: Record<string, PropertyType>): Promise<Record<string, unknown>>;
}
