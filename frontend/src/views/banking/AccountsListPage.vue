<script setup lang="ts">
import GenericDataTable from '@/components/generic-table/GenericDataTable.vue';
import { TABLE_DEFINITION } from './accounts-table-definition';
import type { TableOptions } from '@/types/generic-data-table/option-types';
import type { OpenTreasuryAccount } from '@opentreasury/opentreasury-service-api';
import { ROUTE_NAMES } from '@/router/names';
import { accountService } from '@/helpers/entity-services/account-service';
import { onMounted } from 'vue';

const accountsSettings: TableOptions<OpenTreasuryAccount> = {
    newRecordRoute: ROUTE_NAMES.accountsPage,
    showFilters: true,
    defaultActions: {
        editRoute: (record) => console.log('edit', record),
        onCopy: async (record) => console.log('copy', record),
        onDelete: async (record) => console.log('delete', record)
    }
};

/**
 * fetchPage simul
 */
// const dataSource = {
//     fetchPage: async function fetchAccounts({
//         query,
//         page,
//         sorting
//     }: PageRequest): Promise<PageResponse<OpenTreasuryAccount>> {
//         console.log('Simulated fetchPage called with', { query, page, sorting });
//
//         await new Promise((r) => setTimeout(r, 1000));
//
//         const all: OpenTreasuryAccount[] =
//             store.accounts instanceof Map
//                 ? Array.from(store.accounts.values())
//                 : Object.values(store.accounts ?? {});
//
//         const q = (query ?? '').trim().toLowerCase();
//         const filtered = q
//             ? all.filter((a) => {
//                   return (
//                       (a.name ?? '').toLowerCase().includes(q) ||
//                       (a.alias ?? '').toLowerCase().includes(q) ||
//                       (a.accountNumber ?? '').toLowerCase().includes(q) ||
//                       (a.iban ?? '').toLowerCase().includes(q)
//                   );
//               })
//             : all.slice();
//
//         if (sorting?.sortBy) {
//             const { sortBy, direction = 'asc' } = sorting;
//             filtered.sort((x, y) => {
//                 const vx = (x as any)[sortBy];
//                 const vy = (y as any)[sortBy];
//
//                 if (vx == null && vy == null) return 0;
//                 if (vx == null) return direction === 'asc' ? -1 : 1;
//                 if (vy == null) return direction === 'asc' ? 1 : -1;
//
//                 if (typeof vx === 'number' && typeof vy === 'number') {
//                     return direction === 'asc' ? vx - vy : vy - vx;
//                 }
//
//                 const sx = String(vx).toLowerCase();
//                 const sy = String(vy).toLowerCase();
//                 if (sx < sy) return direction === 'asc' ? -1 : 1;
//                 if (sx > sy) return direction === 'asc' ? 1 : -1;
//                 return 0;
//             });
//         }
//
//         const currentPage = page?.page ?? 0;
//         const pageSize = page?.size ?? 10;
//         const start = currentPage * pageSize;
//         const end = start + pageSize;
//         const pageContent = filtered.slice(start, end);
//
//         return {
//             content: pageContent,
//             pageInfo: {
//                 totalCount: filtered.length,
//                 totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
//                 size: pageSize,
//                 page: currentPage
//             }
//         };
//     }
// };

//testovacie ucely fetchAll, fetchById, save/update a delete
// onMounted(async () => {
//     try {
//         console.log('TEST START');

//         // fetchAll
//         const all = await accountService.fetchAll();
//         console.log('fetchAll:', all);

//         // fetchById
//         const account = await accountService.fetchById('6882c8c045b1621a87a06a30');
//         console.log('fetchById:', account);

//         // save/update
//         const saved = await accountService.saveEntity({
//             ...account,
//             name: 'Test ucet'
//         });
//         console.log('save/update:', saved);

//         // delete
//         await accountService.deleteEntity('6882c9e145b1621a87a06a3c');
//         console.log('Deleted!'); // bude stale fungovat aj pri neexistujucom id, pretoze backend v requeste vracia 204 no content

//         console.log('CRUD TEST DONE');
//     } catch (err) {
//         console.error('CRUD TEST FAILED:', err);
//     }
// });

onMounted(async () => {
    try {
        console.log('🚀 TEST START — fetchPage s typovou konverziou');

        const result = await accountService.fetchPage({
            pagination: { page: 0, pageSize: 10 }
        });

        console.log('✅ [FRONTEND] FetchPage result:', result.content);

        // Skontroluj či sa napr. activeFrom stal Date objektom:
        if (result.content[0]?.activeFrom instanceof Date) {
            console.log('🧩 Date conversion OK:', result.content[0].activeFrom);
        } else {
            console.warn('⚠️ Date conversion FAILED:', result.content[0].activeFrom);
        }
    } catch (err) {
        console.error('❌ TEST FAILED:', err);
    }
});
</script>

<template>
    <card>
        <template #title>{{ ROUTE_NAMES.accountsPage }}</template>
        <template #content>
            <generic-data-table
                :definition="TABLE_DEFINITION"
                :data-source="accountService"
                :options="accountsSettings"
            />
        </template>
    </card>
</template>
