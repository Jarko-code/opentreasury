import { defineStore } from 'pinia';
import { useServiceAPI } from '@/service-api';
import type { OpenTreasuryObjectDefinition } from '@opentreasury/opentreasury-service-api';

export const useDefinitionsStore = defineStore('definitions', {
    state: () => ({
        serviceAPI: useServiceAPI(),
        definitions: [] as OpenTreasuryObjectDefinition[],
        definition: {} as OpenTreasuryObjectDefinition
    }),

    actions: {
        async fetchAllDefinitions(): Promise<void> {
            try {
                const response =
                    (await this.serviceAPI.objectDefinitionsService.fetchAllObjectDefinitions()) ??
                    [];
                this.definitions = response;
            } catch (error) {
                console.error('Error in fetchAllDefinitions:', error);
            }
        },

        async fetchDefinitionById(id: string): Promise<void> {
            try {
                const response =
                    await this.serviceAPI.objectDefinitionsService.fetchObjectDefinitionById(id);
                this.definition = response;
            } catch (error) {
                console.error('Error in fetchDefinitionById:', error);
            }
        }
    }
});
