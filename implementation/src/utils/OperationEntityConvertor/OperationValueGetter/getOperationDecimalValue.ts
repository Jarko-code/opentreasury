import { ApiDecimalDynaPropertyDetails, ApiDynaProperty } from '../../../api-types.js';

export function getOperationDecimalValue(value: number, property: ApiDynaProperty<ApiDecimalDynaPropertyDetails>): number {
    const { precision } = property.details;

    const coefficient = 10 ** precision;
    return Math.ceil(value * coefficient);
}
