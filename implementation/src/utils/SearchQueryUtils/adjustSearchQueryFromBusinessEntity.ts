import { FilterCollection } from '@opentreasury/opentreasury-service-api';
import {
    BUSINESS_ENTITY_TIME_PROPERTY,
    BUSINESS_ENTITY_USER_PROPERTY,
    BusinessEntityParamMap,
    OPERATOR_MAP,
} from '../constants.js';
import { getDateQueryParameter } from './SearchQueryParameterGetters/getDateQueryParameter.js';
import { ApiSearchQuery, ApiSearchQueryParameter, ApiSearchQueryParameterType } from '../../api-types.js';

export function adjustSearchQueryFromBusinessEntity(sourceQuery: FilterCollection, targetSearchQuery: ApiSearchQuery) {
    for (const key of Object.keys(BusinessEntityParamMap)) {
        const { value, matchMode } = sourceQuery[key] ?? { value: null, matchMode: null };

        if (value == null) continue;

        if (BUSINESS_ENTITY_TIME_PROPERTY.includes(key)) {
            targetSearchQuery.parameters[key] = getDateQueryParameter(matchMode, value);
        } else if (BUSINESS_ENTITY_USER_PROPERTY.includes(key)) {
            //todo tady se musi udelat vazba na uzivatele
            targetSearchQuery.parameters[key] = {
                operator: OPERATOR_MAP[matchMode],
                type: ApiSearchQueryParameterType.STRING,
                value: value,
            } as ApiSearchQueryParameter;
        } else if (key === 'id') {
            targetSearchQuery.parameters[key] = {
                operator: OPERATOR_MAP[matchMode],
                type: ApiSearchQueryParameterType.ENTITY_REFERENCE,
                value: value,
            } as ApiSearchQueryParameter;
        } else {
            targetSearchQuery.parameters[key] = {
                operator: OPERATOR_MAP[matchMode],
                type: ApiSearchQueryParameterType.STRING,
                value: value,
            } as ApiSearchQueryParameter;
        }
    }

    return targetSearchQuery;
}
