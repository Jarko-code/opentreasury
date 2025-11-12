import { getDecimalValue } from './ValueGetters/getDecimalValue.js';
import { getDateValue } from './ValueGetters/getDateValue.js';
import { OpenTreasuryObject } from '@opentreasury/opentreasury-service-api';
import { BUSINESS_ENTITY_TIME_PROPERTY, BusinessEntityParamMap } from '../constants.js';
import { ApiEntity, ApiOperationDefinition } from '../../api-types.js';

export const copyValuesFromOperationToEntityByOperationDefinition = <T extends OpenTreasuryObject>(
    sourceObject: ApiEntity,
    targetObject: T,
    operationDefinition: ApiOperationDefinition,
) => {
    copyBusinessEntityData(sourceObject, targetObject);

    Object.entries(operationDefinition.model.dynaProperties).forEach(([name, property]) => {
        const propertyType = property.details.type;

        const value = sourceObject.content[name];
        switch (propertyType) {
            case 'DATE_TIME':
            case 'DATE':
                targetObject[name as keyof T] = getDateValue(value) as unknown as T[keyof T];
                break;
            case 'DECIMAL':
                targetObject[name as keyof T] = getDecimalValue(value, property) as unknown as T[keyof T];
                break;
            default:
                targetObject[name as keyof T] = sourceObject.content[name];
                break;
        }
    });
    return targetObject;
};

function copyBusinessEntityData<T extends OpenTreasuryObject>(sourceObject: ApiEntity, targetObject: T): T {
    for (const key of Object.keys(BusinessEntityParamMap)) {
        if (BUSINESS_ENTITY_TIME_PROPERTY.includes(key)) {
            targetObject[key] = getDateValue(sourceObject[key]);
        } else {
            targetObject[key] = sourceObject[key];
        }
    }

    return targetObject;
}
