import { FilterOperator, FilterValue } from '@opentreasury/opentreasury-service-api';
import { OPERATOR_MAP } from '../../constants.js';
import { formatDateToLocal } from '../../utils.js';
import { ApiSearchQueryParameter, ApiSearchQueryParameterType } from '../../../api-types.js';

export function getDateQueryParameter(operator: FilterOperator, value: FilterValue): ApiSearchQueryParameter {
    return {
        operator: OPERATOR_MAP[operator],
        type: ApiSearchQueryParameterType.DATE,
        value: formatDateToLocal(value as Date),
        negation: operator === FilterOperator.DATE_IS_NOT,
    };
}
