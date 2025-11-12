import { BusinessEntityParamMap } from './constants.js';
import { ApiEntity, ApiEntityList, ApiSorting } from '../api-types.js';

export function formatDateToLocal(date: Date) {
    const pad = (n: number) => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are zero-based
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliSeconds = pad(date.getMilliseconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliSeconds}`;
}

export function getPageInfo(response: ApiEntityList<ApiEntity>) {
    return {
        totalCount: response.pagination.totalCount,
        totalPages: Math.ceil(response.pagination.totalCount / response.pagination.pageSize),
        size: response.pagination.pageSize,
        page: response.pagination.page,
    };
}

export function isTokenExpiringSoon(): boolean {
    if (localStorage && window) {
        const savedPrincipal = localStorage.getItem('AUTH-PRINCIPAL');

        if (savedPrincipal == null) return false;

        const parsedPrincipal = JSON.parse(savedPrincipal);
        const expiration = new Date(parsedPrincipal.tokenExpiration).getTime();
        const currentTime = Date.now();
        const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
        return expiration - currentTime <= fiveMinutes;
    }

    return false;
}

export function getAdjustedSorting(sorting?: ApiSorting): ApiSorting | undefined {
    if (sorting) {
        const adjustedSorting = { ...sorting };
        const { field } = adjustedSorting;
        adjustedSorting.field = Object.keys(BusinessEntityParamMap).includes(field) ? field : `content.values.${field}`;

        return adjustedSorting;
    }
}
