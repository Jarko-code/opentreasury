import { OpenTreasuryScript } from '@opentreasury/opentreasury-service-api';
import { OpenTreasuryScriptServiceApi } from './OpenTreasuryScriptServiceApi.js';
import OPSError from '../../../utils/ServiceRepository/OPSError.js';
import { BaseOpenTreasuryServiceApi } from '../BaseOpenTreasuryServiceApi.js';
import { ApiEntityService } from '../../../api-types.js';

class OpenTreasuryScriptServiceApiImplementation
    extends BaseOpenTreasuryServiceApi<OpenTreasuryScript>
    implements OpenTreasuryScriptServiceApi
{
    protected entityType = 'script' as const;
    protected getApiService(): ApiEntityService {
        return this._api.ProcessingService.definitions;
    }

    async run(scriptId: string, values: Record<string, any>): Promise<any> {
        return (await this._api.ProcessingService.processes.runProcess(scriptId, values)).data;
    }

    async runSync<T = any>(definitionId: string, payload: Record<string, any>): Promise<T> {
        try {
            const response = await this._api.ProcessingService.processes.save({
                definitionId,
                values: payload,
            } as any);

            if (!response.details) {
                throw new OPSError(`Failed to execute script definition ${definitionId}`);
            }

            return response.details as T;
        } catch (error) {
            console.error('Error in OpenTreasuryScriptServiceApi.save:', error);
            throw new OPSError('Failed to synchronously execute script.');
        }
    }
}

export { OpenTreasuryScriptServiceApiImplementation };
