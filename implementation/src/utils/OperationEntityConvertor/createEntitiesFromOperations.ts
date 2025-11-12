import { copyValuesFromOperationToEntityByOperationDefinition } from './copyValuesFromOperationToEntityByOperationDefinition.js';
import { OpenTreasuryObject } from '@opentreasury/opentreasury-service-api';
import { ApiEntity, ApiOperationDefinition } from '../../api-types.js';

export const createEntitiesFromOperations = <T extends OpenTreasuryObject>(
    operations: Array<ApiEntity>,
    type: {
        new (): T;
    },
    operationDefinition: ApiOperationDefinition,
): Array<T> => {
    return operations.map((operation) => {
        const entity = new type();
        return copyValuesFromOperationToEntityByOperationDefinition<T>(operation, entity, operationDefinition);
    });
};
