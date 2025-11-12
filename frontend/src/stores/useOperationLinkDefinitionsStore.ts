import { defineStore } from 'pinia';
import { useServiceAPI } from '@/service-api';
import type {
    OperationLinkDefinition,
    OperationLink
} from '@opentreasury/opentreasury-service-api';

export const useOperationLinkDefinitionsStore = defineStore('operationLinkDefinitions', {
    state: () => ({
        serviceAPI: useServiceAPI(),
        operationLinkDefinitions: [] as OperationLinkDefinition[],
        operationLinkDefinition: {} as OperationLinkDefinition,

        operationLinks: [] as OperationLink[]
    }),

    actions: {
        async fetchAllOperationLinkDefinitions(): Promise<OperationLinkDefinition[]> {
            try {
                const result =
                    await this.serviceAPI.objectDefinitionsService.fetchAllOperationLinkDefinitions<OperationLinkDefinition>();

                this.operationLinkDefinitions = result;
                return result;
            } catch (error) {
                console.error('Error in fetchAllOperationLinkDefinitions:', error);
                return [];
            }
        },

        async saveOperationLinkDefinition(
            definition: OperationLinkDefinition
        ): Promise<OperationLinkDefinition | null> {
            try {
                const saved =
                    await this.serviceAPI.objectDefinitionsService.saveOperationLinkDefinition(
                        definition
                    );

                const exists = this.operationLinkDefinitions.find((d) => d.id === saved.id);
                if (exists) {
                    this.operationLinkDefinitions = this.operationLinkDefinitions.map((d) =>
                        d.id === saved.id ? saved : d
                    );
                } else {
                    this.operationLinkDefinitions.push(saved);
                }

                this.operationLinkDefinition = saved;
                return saved;
            } catch (error) {
                console.error('Error in saveOperationLinkDefinition:', error);
                return null;
            }
        },

        async updateOperationLinkDefinition(
            definition: OperationLinkDefinition
        ): Promise<OperationLinkDefinition | null> {
            try {
                const updated =
                    await this.serviceAPI.objectDefinitionsService.updateOperationLinkDefinition(
                        definition
                    );

                const exists = this.operationLinkDefinitions.find((d) => d.id === updated.id);
                if (exists) {
                    this.operationLinkDefinitions = this.operationLinkDefinitions.map((d) =>
                        d.id === updated.id ? updated : d
                    );
                } else {
                    this.operationLinkDefinitions.push(updated);
                }

                this.operationLinkDefinition = updated;
                return updated;
            } catch (error) {
                console.error('Error in updateOperationLinkDefinition:', error);
                return null;
            }
        },

        // načíta všetky linky pre danú operáciu
        async fetchOperationLinksByOperationId(operationId: string): Promise<OperationLink[]> {
            try {
                const result =
                    await this.serviceAPI.objectDefinitionsService.fetchOperationLinksByOperationId<OperationLink>(
                        operationId
                    );

                this.operationLinks = result;
                return result;
            } catch (error) {
                console.error('Error in fetchOperationLinksByOperationId:', error);
                return [];
            }
        },

        // uloženie (vytvorenie) novej väzby medzi operáciami
        async saveOperationLink(link: {
            linkDefinition: string;
            primarySide: string;
            secondarySide: string;
        }): Promise<OperationLink | null> {
            try {
                const saved =
                    await this.serviceAPI.objectDefinitionsService.saveOperationLink<OperationLink>(
                        link
                    );

                if (saved) {
                    this.operationLinks.push(saved);
                    return saved;
                }

                return null;
            } catch (error) {
                console.error('Error in saveOperationLink:', error);
                return null;
            }
        },

        // zmazanie existujúcej väzby
        async deleteOperationLink(linkId: string): Promise<void> {
            try {
                await this.serviceAPI.objectDefinitionsService.deleteOperationLink(linkId);

                // odstrániť aj z lokálneho state
                this.operationLinks = this.operationLinks.filter((l) => l.id !== linkId);
            } catch (error) {
                console.error('Error in deleteOperationLink:', error);
            }
        },

        // načíta všetky linky pre daný linkDefinition (napr. Úvěr–Úrok, jt, test2, ...)
        async fetchOperationLinksByLinkDefinitionId(
            linkDefinitionId: string
        ): Promise<OperationLink[]> {
            try {
                const result =
                    await this.serviceAPI.objectDefinitionsService.fetchOperationLinksByLinkDefinitionId<OperationLink>(
                        linkDefinitionId
                    );

                return result || [];
            } catch (error) {
                console.error(
                    `Error in fetchOperationLinksByLinkDefinitionId(${linkDefinitionId}):`,
                    error
                );
                return [];
            }
        }
    }
});
