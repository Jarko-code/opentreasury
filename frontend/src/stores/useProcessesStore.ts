import { defineStore } from 'pinia';
import { useServiceAPI } from '@/service-api';
import type { OpenTreasuryProcesses, Sorting } from '@opentreasury/opentreasury-service-api';

export const useProcessesStore = defineStore('processes', {
    state: () => ({
        serviceAPI: useServiceAPI(),
        processes: [] as OpenTreasuryProcesses[],
        process: {} as OpenTreasuryProcesses,
        totalProcesses: 0,
        page: 0,
        size: 20,
        sorting: null as Sorting | null
    }),

    actions: {
        async fetchAllProcesses(
            page = 0,
            size = 10,
            sorting?: Sorting
        ): Promise<{ content: OpenTreasuryProcesses[]; total: number }> {
            try {
                const result = await this.serviceAPI.processesService.fetchAllProcesses(
                    page,
                    size,
                    sorting
                );

                this.processes = result.content;
                this.totalProcesses = result.total;

                return result;
            } catch (error) {
                console.error('Error in fetchAllProcesses:', error);
                return { content: [], total: 0 };
            }
        }
    }
});
