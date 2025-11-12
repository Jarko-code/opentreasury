import { OpenTreasuryObject } from '@opentreasury/opentreasury-service-api';
import { OpenTreasuryObjectServiceApi } from './OpenTreasuryObjectServiceApi.js';
import { BaseOpenTreasuryServiceApi } from '../BaseOpenTreasuryServiceApi.js';
import { ApiEntityService } from '../../../api-types.js';

class OpenTreasuryObjectServiceApiImplementation
    extends BaseOpenTreasuryServiceApi<OpenTreasuryObject>
    implements OpenTreasuryObjectServiceApi
{
    protected entityType = 'object' as const;
    protected getApiService(): ApiEntityService {
        return this._api.OperationService.operations;
    }

    // async fetchOperationById<T extends OpenTreasuryOperation>(id: string): Promise<T> {
    //         const operation = await this._operationService.operations.get(id);

    //         if (!operation) {
    //             throw new OPSError(`Operation with id ${id} not found.`);
    //         }

    //         const definition = this._getOperationDefinition(operation.operationDefinition);

    //         return adjustOperations<T>([operation], definition)[0];
    //     }
}

export { OpenTreasuryObjectServiceApiImplementation };
