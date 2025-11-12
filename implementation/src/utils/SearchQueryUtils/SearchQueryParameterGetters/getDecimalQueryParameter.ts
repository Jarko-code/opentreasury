import { FilterOperator, FilterValue } from '@opentreasury/opentreasury-service-api';
import { OPERATOR_MAP } from '../../constants.js';
import { getOperationDecimalValue } from '../../OperationEntityConvertor/OperationValueGetter/getOperationDecimalValue.js';
import { ApiDecimalDynaPropertyDetails, ApiDynaProperty, ApiSearchQueryParameter } from '../../../api-types.js';

export function getDecimalQueryParameter(
    operator: FilterOperator,
    value: FilterValue,
    property: ApiDynaProperty<ApiDecimalDynaPropertyDetails>,
): ApiSearchQueryParameter {
    return {
        operator: OPERATOR_MAP[operator],
        type: 'float',
        value: getOperationDecimalValue(value as number, property).toString(),
        negation: false,
    };
}
