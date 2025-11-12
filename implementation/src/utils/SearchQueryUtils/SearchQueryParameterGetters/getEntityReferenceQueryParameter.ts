import { FilterOperator, FilterValue } from '@opentreasury/opentreasury-service-api';
import { OPERATOR_MAP } from '../../constants.js';
import { ApiSearchQueryParameter, ApiSearchQueryParameterType } from '../../../api-types.js';

export function getEntityReferenceQueryParameter(operator: FilterOperator, value: FilterValue): ApiSearchQueryParameter {
    return {
        operator: OPERATOR_MAP[operator],
        type: ApiSearchQueryParameterType.ENTITY_REFERENCE,
        value: value as string,
        negation: operator === FilterOperator.NOT_EQUALS || operator === FilterOperator.NOT_CONTAINS,
    };
}
