import { Nullable } from '../../types.js';
import { ApiDecimalDynaPropertyDetails, ApiDynaProperty } from '../../../api-types.js';

export const getDecimalValue = (value: Nullable<number>, property: ApiDynaProperty<ApiDecimalDynaPropertyDetails>) => {
    const precision = (property as ApiDynaProperty<ApiDecimalDynaPropertyDetails>).details.precision;
    const coefficient = 10 ** precision;

    return value ? Math.round(Number(value / coefficient) * coefficient) / coefficient : null;
};
