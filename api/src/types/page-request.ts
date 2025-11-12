export interface PageRequest {
    filters?: FilterCollection;
    pagination?: PaginationInfo;
    sorting?: SortingCriteria;
}

export interface PaginationInfo {
    page: number;
    pageSize: number;
}

export type FilterCollection = Record<string, FilterCriterion>;

export interface FilterCriterion {
    value: FilterValue;
    matchMode: FilterOperator;
    type: FilterValueType;
}

export type FilterValue = string | number | Date | null | FilterOperator;

export enum FilterOperator {
    EQUALS = 'equals',
    NOT_EQUALS = 'notEquals', // nema byt pouze negation == true ??
    IN = 'in',
    CONTAINS = 'contains',
    NOT_CONTAINS = 'notContains', // nema byt pouze negation == true ??
    STARTS_WITH = 'startsWith',
    ENDS_WITH = 'endsWith',

    LESS_THAN = 'lt',
    LESS_THAN_OR_EQUAL = 'lte',
    GREATER_THAN = 'gt',
    GREATER_THAN_OR_EQUAL = 'gte',
    BETWEEN = 'between',
    DATE_IS = 'dateIs',
    DATE_IS_NOT = 'dateIsNot', // nema byt pouze negation == true ??
    DATE_BEFORE = 'dateBefore',
    DATE_AFTER = 'dateAfter',
    QUERY = 'query',
}

export enum FilterValueType {
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    ENTITY_REFERENCE = 'entity_reference',
    DATE = 'date',
    STRING = 'string',
}

export interface SortingCriteria {
    field: string;
    direction: SortDirection;
}

export enum SortDirection {
    ASC = 1,
    DESC = -1,
}
