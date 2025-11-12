import { defineStore } from 'pinia';
import { useServiceAPI } from '@/service-api';
import {

    type SavedFilter,
    type OpenTreasuryObjectDefinition,

    type OpenTreasuryObject, type SortingCriteria, type FilterCollection
} from '@opentreasury/opentreasury-service-api';

export const useOperationsStore = defineStore('operations', {
    state: () => ({
        serviceAPI: useServiceAPI(),
        operations: [] as OpenTreasuryObject[],
        operation: {} as OpenTreasuryObjectDefinition,
        operationFromScript: {} as OpenTreasuryObjectDefinition,
        operationsByDefinition: new Map<string, Map<string, OpenTreasuryObjectDefinition>>(),
        totalOperations: 0,
        page: 0,
        size: 20,
        sorting: null as SortingCriteria | null,
        filters: {} as FilterCollection,

        // --- Filtre ---
        savedFilters: [] as SavedFilter[],
        selectedFilter: null as string | null
    }),

    actions: {
        async fetchAllOperations(
            page = 0,
            size = 10,
            filters?: FilterCollection,
            sorting?: SortingCriteria,
            operationDefinitionId?: string
        ): Promise<{ content: OpenTreasuryObjectDefinition[]; total: number }> {
            try {
                // const result = await this.serviceAPI.entityServices.objectService.fetchPage({
                //     page: { page, size },
                //     query: {
                //         ...filters,
                //         operationDefinition: {
                //             value: operationDefinitionId!,
                //             matchMode: QueryOperator.equals,
                //             type: QueryParameterType.STRING
                //         }
                //     },
                //     sorting
                // });
                //
                // this.operations = result.content as OpenTreasuryObjectDefinition[];
                // this.totalOperations = result.pageInfo.totalCount;
                //
                // return result;
            } catch (error) {
                console.error('Error in fetchAllOperations:', error);
                return { content: [], total: 0 };
            }
        },

        async fetchReferencedOperationsForDefinition(definition: any): Promise<void> {
            try {
                this.operationsByDefinition.clear();

                if (!definition?.model?.dynaProperties) {
                    console.warn('⚠️ Definition has no dynamic properties.');
                    return;
                }

                const referencedDefinitions = new Map<string, string>();

                for (const [propName, prop] of Object.entries(
                    definition.model.dynaProperties
                ) as any) {
                    if (
                        prop.details?.type === 'ENTITY_REFERENCE' &&
                        prop.details?.entityType?.toLowerCase() === 'operation'
                    ) {
                        const operationDefId =
                            prop.details?.entityFilter?.parameters?.operationDefinition?.value;
                        if (operationDefId) {
                            referencedDefinitions.set(propName, operationDefId);
                        }
                    }
                }

                if (!referencedDefinitions.size) {
                    console.log('No referenced operation definitions found.');
                    return;
                }

                for (const [fieldName, refDefId] of referencedDefinitions.entries()) {
                    const result =
                        await this.serviceAPI.objectDefinitionsService.fetchAllOperations(
                            0,
                            50000,
                            undefined,
                            undefined,
                            refDefId
                        );

                    const map = new Map<string, OpenTreasuryObjectDefinition>();
                    for (const op of result.content) {
                        if (op?.id) map.set(op.id, op);
                    }

                    this.operationsByDefinition.set(refDefId, map);
                }
            } catch (error) {
                console.error('Error in fetchReferencedOperationsForDefinition:', error);
            }
        },

        getOperationName(id: string, operationDefinitionId?: string): string {
            if (!operationDefinitionId) return id;
            const map = this.operationsByDefinition.get(operationDefinitionId);
            return map?.get(id)?.name ?? id;
        },

        async fetchOperationById(id: string): Promise<OpenTreasuryObjectDefinition | null> {
            try {
                const response =
                    await this.serviceAPI.objectDefinitionsService.fetchOperationById(id);
                this.operation = response;
                return response;
            } catch (error) {
                console.error('Error in fetchOperationById:', error);
                return null;
            }
        },

        async deleteOperation(id: string): Promise<void> {
            await this.serviceAPI.objectDefinitionsService.deleteOperation(id);
        },

        async saveOperation(
            operation: OpenTreasuryObjectDefinition
        ): Promise<OpenTreasuryObjectDefinition | null> {
            try {
                const saved =
                    await this.serviceAPI.objectDefinitionsService.saveOperation(operation);

                // ak ukladáš novú operáciu → pridaj ju do lokálneho zoznamu
                const exists = this.operations.find((op) => op.id === saved.id);
                if (exists) {
                    this.operations = this.operations.map((op) =>
                        op.id === saved.id ? saved : op
                    );
                } else {
                    this.operations.push(saved);
                }

                this.operation = saved;
                return saved;
            } catch (error) {
                console.error('Error in saveOperation:', error);
                return null;
            }
        },

        async updateOperation(
            operation: OpenTreasuryObjectDefinition
        ): Promise<OpenTreasuryObjectDefinition | null> {
            try {
                const updated =
                    await this.serviceAPI.objectDefinitionsService.updateOperation(operation);

                const exists = this.operations.find((op) => op.id === updated.id);
                if (exists) {
                    this.operations = this.operations.map((op) =>
                        op.id === updated.id ? updated : op
                    );
                } else {
                    this.operations.push(updated);
                }

                this.operation = updated;
                return updated;
            } catch (error) {
                console.error('Error in updateOperation:', error);
                return null;
            }
        },

        // --- Filtre ---
        async fetchAllFilters(operationDefinitionId?: string): Promise<SavedFilter[]> {
            try {
                const result =
                    await this.serviceAPI.objectDefinitionsService.fetchAllFilters(
                        operationDefinitionId
                    );
                this.savedFilters = result;
                return result;
            } catch (error) {
                console.error('Error in fetchAllFilters:', error);
                return [];
            }
        },

        async saveFilter(filter: SavedFilter): Promise<void> {
            try {
                await this.serviceAPI.objectDefinitionsService.saveFilter(filter);

                // Po uložení sprav refetch všetkých filtrov
                const refreshed = await this.fetchAllFilters(
                    filter.parameters?.operationDefinition?.value
                );
                this.savedFilters = refreshed;
            } catch (error) {
                console.error('Error saving filter:', error);
            }
        },
        async deleteFilter(id: string): Promise<void> {
            try {
                await this.serviceAPI.objectDefinitionsService.deleteFilter(id);
                this.savedFilters = this.savedFilters.filter((f) => f.id !== id);
                if (this.selectedFilter === id) {
                    this.selectedFilter = null;
                }
            } catch (error) {
                console.error('Error in deleteFilter:', error);
            }
        },

        setOperationFromScript(newValue: Record<string, any>) {
            this.operationFromScript = newValue as unknown as OpenTreasuryObjectDefinition;
        }
    }
});
