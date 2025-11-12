import { FilterOperator } from '@opentreasury/opentreasury-service-api';
import { ApiPageRequest, ApiSearchQueryParameterOperator } from '../api-types.js';

export const FIRST_PAGE = new ApiPageRequest(0, 100000);
export const BusinessEntityParamMap = {
    creator: 'creator',
    updatedBy: 'updatedBy',
    createdTimestamp: 'createdTimestamp',
    updatedTimestamp: 'updatedTimestamp',
    operationDefinition: 'operationDefinition',
    securityGroup: 'securityGroup',
    userApplicationACL: 'userApplicationACL',
    roleApplicationACL: 'roleApplicationACL',
    source: 'source',
    name: 'name',
    actualStatus: 'actualStatus',
    active: 'active',
    id: 'id',
};

export const OPERATOR_MAP: { [key in FilterOperator]: ApiSearchQueryParameterOperator } = {
    [FilterOperator.GREATER_THAN]: ApiSearchQueryParameterOperator.GT,
    [FilterOperator.GREATER_THAN_OR_EQUAL]: ApiSearchQueryParameterOperator.GTE,
    [FilterOperator.LESS_THAN]: ApiSearchQueryParameterOperator.LT,
    [FilterOperator.LESS_THAN_OR_EQUAL]: ApiSearchQueryParameterOperator.LTE,
    [FilterOperator.IN]: ApiSearchQueryParameterOperator.IN,
    [FilterOperator.EQUALS]: ApiSearchQueryParameterOperator.EQ,
    [FilterOperator.STARTS_WITH]: ApiSearchQueryParameterOperator.LIKE,
    [FilterOperator.CONTAINS]: ApiSearchQueryParameterOperator.LIKE,
    [FilterOperator.ENDS_WITH]: ApiSearchQueryParameterOperator.LIKE,
    [FilterOperator.DATE_IS]: ApiSearchQueryParameterOperator.EQ,
    [FilterOperator.DATE_BEFORE]: ApiSearchQueryParameterOperator.LT,
    [FilterOperator.DATE_AFTER]: ApiSearchQueryParameterOperator.GT,
    [FilterOperator.DATE_IS_NOT]: ApiSearchQueryParameterOperator.EQ,

    //TODO
    [FilterOperator.QUERY]: ApiSearchQueryParameterOperator.EQ,
    [FilterOperator.BETWEEN]: ApiSearchQueryParameterOperator.EQ,
    [FilterOperator.NOT_EQUALS]: ApiSearchQueryParameterOperator.EQ,
    [FilterOperator.NOT_CONTAINS]: ApiSearchQueryParameterOperator.LIKE,
};
export const BUSINESS_ENTITY_TIME_PROPERTY = ['createdTimestamp', 'updatedTimestamp'];
export const BUSINESS_ENTITY_USER_PROPERTY = ['creator', 'updatedBy'];
export const PAGE_REQUEST_1000 = new ApiPageRequest(0, 1000);
