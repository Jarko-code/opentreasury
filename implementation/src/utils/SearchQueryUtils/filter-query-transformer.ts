import { SearchQueryParameter } from '@livesystems/openplatform-client-ts';
import { ApiSearchQuery } from '../../api-types.js';
import { OPERATOR_MAP } from '../constants.js';
import { FilterCollection, FilterCriterion, FilterOperator, FilterValueType } from '@opentreasury/opentreasury-service-api';

/**
 * Utility class for transforming OpenTreasury filters
 * into an ApiSearchQuery structure expected by backend.
 */
export class FilterQueryTransformer {
    /**
     * Main entry point — converts filters to ApiSearchQuery.
     */
    static transform(filters?: FilterCollection): ApiSearchQuery {
        const query = new ApiSearchQuery();
        if (!filters) return query;

        for (const [key, filter] of Object.entries(filters)) {
            const param = this.createParameter(key, filter);
            if (param) query.parameters[key] = param;
        }

        return query;
    }

    /**
     * Builds a single SearchQueryParameter from a FilterCriterion.
     */
    private static createParameter(key: string, filter: FilterCriterion): SearchQueryParameter | null {
        const operator = this.resolveOperator(filter.matchMode);
        const rawValue = filter.value;

        // skip invalid or empty values
        if ((rawValue == null || rawValue === undefined) && filter.matchMode !== FilterOperator.NOT_EQUALS) {
            return null;
        }

        // enforce type presence — no fallback to STRING
        const { type } = filter;
        const value = this.mapValue(rawValue, type);
        const negation = this.isNegationOperator(filter.matchMode);

        return new SearchQueryParameter(operator, type, value, negation);
    }

    /**
     * Converts a raw filter value into a string for API.
     */
    private static mapValue(rawValue: unknown, type: FilterValueType): string {
        if (type === FilterValueType.DATE && rawValue instanceof Date) {
            return rawValue.toISOString();
        }
        return String(rawValue ?? '');
    }

    /**
     * Maps FilterOperator to API-specific operator.
     */
    private static resolveOperator(operator: FilterOperator): string {
        return OPERATOR_MAP[operator];
    }

    /**
     * Determines whether the operator is negated (NOT_EQUALS, etc.).
     */
    private static isNegationOperator(operator: FilterOperator): boolean {
        return (
            operator === FilterOperator.NOT_EQUALS ||
            operator === FilterOperator.NOT_CONTAINS ||
            operator === FilterOperator.DATE_IS_NOT
        );
    }
}
