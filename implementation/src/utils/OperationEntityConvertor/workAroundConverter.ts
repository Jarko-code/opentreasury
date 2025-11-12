//TODO treba refaktorovat pri pouziti, zatim se nevyuziva
import { OpenTreasuryObject } from '@opentreasury/opentreasury-service-api';
import { OpenTreasuryObjectDefinition } from '@opentreasury/opentreasury-service-api';
import { getDateValue } from './ValueGetters/getDateValue.js';
import { getDecimalValue } from './ValueGetters/getDecimalValue.js';
import { BUSINESS_ENTITY_TIME_PROPERTY, BusinessEntityParamMap } from '../constants.js';
import { EntityOperation } from '../types.js';
import { getOperationDateTimeValue, getOperationDateValue } from './OperationValueGetter/getOperationDateValue.js';
import { getOperationDecimalValue } from './OperationValueGetter/getOperationDecimalValue.js';
import { ApiEntity } from '../../api-types.js';

export const adjustOperations = <T extends OpenTreasuryObject>(
    operations: Array<ApiEntity>,
    operationDefinition: OpenTreasuryObjectDefinition,
): Array<T> => {
    return operations.map((operation) => {
        //@ts-ignore
        const entity = { content: {} } as T;
        return copyValuesFromOperationToEntityByOperationDefinition2<T>(operation, entity, operationDefinition);
    });
};
const copyValuesFromOperationToEntityByOperationDefinition2 = <T extends OpenTreasuryObject>(
    sourceObject: ApiEntity,
    targetObject: T,
    operationDefinition: OpenTreasuryObjectDefinition,
) => {
    copyBusinessEntityData2(sourceObject, targetObject);

    Object.entries(operationDefinition.model.dynaProperties).forEach(([name, property]) => {
        const propertyType = property.details.type;

        const value = sourceObject.content[name];
        switch (propertyType) {
            case 'DATE_TIME':
            case 'DATE':
                //@ts-ignore
                targetObject.content[name] = getDateValue(value);
                break;
            case 'DECIMAL':
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                targetObject.content[name] = getDecimalValue(value, property);
                break;
            default:
                //@ts-ignore
                targetObject.content[name] = sourceObject.content[name];
                break;
        }
    });
    return targetObject;
};

function copyBusinessEntityData2<T extends OpenTreasuryObject>(sourceObject: ApiEntity, targetObject: T): T {
    for (const key of Object.keys(BusinessEntityParamMap)) {
        if (BUSINESS_ENTITY_TIME_PROPERTY.includes(key)) {
            targetObject[key] = getDateValue(sourceObject[key]);
        } else {
            targetObject[key] = sourceObject[key];
        }
    }

    return targetObject;
}

export const getOperationToSave = <T extends OpenTreasuryObject>(
    sourceObject: T,
    targetObject: EntityOperation,
    operationDefinition: OpenTreasuryObjectDefinition,
) => {
    Object.entries(operationDefinition.model.dynaProperties).forEach(([name, property]) => {
        const propertyType = property.details.type;
        //@ts-ignore
        const value = sourceObject.content[name];

        switch (propertyType) {
            case 'DATE_TIME':
                targetObject.content[name] = getOperationDateTimeValue(value as Date);
                break;
            case 'DATE':
                targetObject.content[name] = getOperationDateValue(value as Date);
                break;
            case 'DECIMAL':
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                targetObject.content[name] = getOperationDecimalValue(value as number, property);
                break;
            default:
                //@ts-ignore
                targetObject.content[name] = sourceObject[name] ?? sourceObject.content[name];
                break;
        }
    });
    return targetObject;
};
