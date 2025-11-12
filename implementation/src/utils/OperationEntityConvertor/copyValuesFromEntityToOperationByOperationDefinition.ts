import { OpenTreasuryObject } from '@opentreasury/opentreasury-service-api';
import { getOperationDecimalValue } from './OperationValueGetter/getOperationDecimalValue.js';
import { EntityOperation } from '../types.js';
import { getOperationDateTimeValue, getOperationDateValue } from './OperationValueGetter/getOperationDateValue.js';
import { ApiOperationDefinition } from '../../api-types.js';

export const copyValuesFromEntityToOperationByOperationDefinition = <T extends OpenTreasuryObject>(
    sourceObject: T,
    targetObject: EntityOperation,
    operationDefinition: ApiOperationDefinition,
) => {
    Object.entries(operationDefinition.model.dynaProperties).forEach(([name, property]) => {
        const propertyType = property.details.type;

        const value = sourceObject[name];
        switch (propertyType) {
            case 'DATE_TIME':
                targetObject.content[name] = getOperationDateTimeValue(value);
                break;
            case 'DATE':
                targetObject.content[name] = getOperationDateValue(value);
                break;
            case 'DECIMAL':
                targetObject.content[name] = getOperationDecimalValue(value, property);
                break;
            default:
                targetObject.content[name] = sourceObject[name];
                break;
        }
    });
    return targetObject;
};
