import { usePaginatedTable } from '@/composables/usePaginatedTable';
import type { FetchResult, FetchParams } from '../../types/global';

// Temporary Store

type AnyStore = Record<string, any>;
type Sort = { field: string; direction: 1 | -1 };

type PagedResponse<T> = { content: T[]; total: number };

function isPagedResponse<T>(x: any): x is PagedResponse<T> {
    return x && typeof x === 'object' && Array.isArray(x.content) && typeof x.total === 'number';
}

export function useStoreGenericTable<T, S extends AnyStore>(
    store: S,
    fetchMethod: keyof S & string,
    initialSort: Sort
) {
    const fn = store[fetchMethod] as unknown as (...args: any[]) => Promise<any>;
    if (typeof fn !== 'function') {
        throw new Error(`Store method "${String(fetchMethod)}" is not a function.`);
    }

    const itemsKey: string | undefined = (store as any).__tableItemsKey; // např. "scripts" / "processes"
    const pageBase: 0 | 1 = (store as any).__tablePageBase === 1 ? 1 : 0;

    return usePaginatedTable<T>(
        async (p: FetchParams): Promise<FetchResult<T>> => {
            const apiPage = pageBase === 1 ? p.page + 1 : p.page;
            const res = await fn(apiPage, p.size, p.sorting);

            if (isPagedResponse<T>(res)) {
                return { items: res.content, total: res.total };
            }
            const arr = itemsKey ? (store as any)[itemsKey] : undefined;
            const all: T[] = Array.isArray(arr) ? arr : [];

            const start = p.page * p.size;
            const end = start + p.size;

            return { items: all.slice(start, end), total: all.length };
        },
        initialSort
    );
}
