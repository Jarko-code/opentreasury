import { FilterOperator, FilterValue } from '@opentreasury/opentreasury-service-api';
import { OPERATOR_MAP } from '../../constants.js';
import { ApiSearchQueryParameter, ApiSearchQueryParameterType } from '../../../api-types.js';

export function getBooleanQueryParameter(operator: FilterOperator, value: FilterValue): ApiSearchQueryParameter {
    return {
        operator: OPERATOR_MAP[operator],
        type: ApiSearchQueryParameterType.BOOLEAN,
        value: value as string,
        negation: false,
    };
}
