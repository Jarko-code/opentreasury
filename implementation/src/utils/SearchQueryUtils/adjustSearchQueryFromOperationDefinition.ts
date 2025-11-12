import { getDateQueryParameter } from './SearchQueryParameterGetters/getDateQueryParameter.js';
import { getDecimalQueryParameter } from './SearchQueryParameterGetters/getDecimalQueryParameter.js';
import { FilterCollection } from '@opentreasury/opentreasury-service-api';
import { getStringQueryParameter } from './SearchQueryParameterGetters/getStringQueryParameter.js';
import { getBooleanQueryParameter } from './SearchQueryParameterGetters/getBooleanQueryParameter.js';
import { getEntityReferenceQueryParameter } from './SearchQueryParameterGetters/getEntityReferenceQueryParameter.js';
import { ApiOperationDefinition, ApiSearchQuery } from '../../api-types.js';

export function adjustSearchQueryFromOperationDefinition(
    sourceQuery: FilterCollection,
    targetSearchQuery: ApiSearchQuery,
    operationDefinition: ApiOperationDefinition,
): ApiSearchQuery {
    const { dynaProperties } = operationDefinition.model;

    for (const [name, property] of Object.entries(dynaProperties)) {
        if (sourceQuery[name]?.value == null) continue;

        const propertyType = property.details.type;

        const { matchMode, value } = sourceQuery[name];

        const parameterName = `content.values.${name}`;

        switch (propertyType) {
            case 'DATE_TIME':
            case 'DATE':
                targetSearchQuery.parameters[parameterName] = getDateQueryParameter(matchMode, value);
                break;
            case 'DECIMAL':
                targetSearchQuery.parameters[parameterName] = getDecimalQueryParameter(matchMode, value, property);
                break;
            case 'BOOLEAN':
                targetSearchQuery.parameters[parameterName] = getBooleanQueryParameter(matchMode, value);
                break;
            case 'ENTITY_REFERENCE':
                targetSearchQuery.parameters[parameterName] = getEntityReferenceQueryParameter(matchMode, value);
                break;
            default:
                targetSearchQuery.parameters[parameterName] = getStringQueryParameter(matchMode, value);
                break;
        }
    }

    return targetSearchQuery;
}
