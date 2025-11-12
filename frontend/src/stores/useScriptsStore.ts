import { defineStore } from 'pinia';
import { useServiceAPI } from '@/service-api';
import type { OpenTreasuryScript } from '@opentreasury/opentreasury-service-api';

export const useScriptsStore = defineStore('scripts', {
    state: () => ({
        serviceAPI: useServiceAPI(),
        scripts: [] as OpenTreasuryScript[],
        script: {} as OpenTreasuryScript,
        scriptResult: null as Record<string, any> | null,
        isLoading: false
    }),

    actions: {
        async fetchAllScripts(): Promise<void> {
            try {
                const response = (await this.serviceAPI.scriptsService.fetchAllScripts()) ?? [];
                this.scripts = response;
            } catch (error) {
                console.error('Error in fetchAllScripts:', error);
            }
        },
        async runSync(scriptId: string, values: Record<string, any>): Promise<any> {
            this.isLoading = true;
            try {
                const response = await this.serviceAPI.scriptsService.run(scriptId, values);
                this.scriptResult = response;
                return response;
            } catch (error) {
                console.error('Error running script:', error);
                throw error;
            } finally {
                this.isLoading = false;
            }
        }
    }
});
