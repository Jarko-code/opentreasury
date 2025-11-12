import { OpenTreasuryObject } from '../entities/open-treasury-object.js';

export interface PageResponse<T extends OpenTreasuryObject> {
    content: Array<T>;
    pageInfo: {
        totalCount: number;
        totalPages: number;
        size: number;
        page: number;
    };
}
