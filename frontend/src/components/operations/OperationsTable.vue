<template>
    <div v-if="definition">
        <SubpageTitle :title="definition.name" />
        <DataTable
            v-model:selection="selectedOperations"
            :value="operationValueWithRefs"
            selectionMode="multiple"
            dataKey="id"
            scrollable
            resizableColumns
            columnResizeMode="expand"
            style="min-width: 60rem"
            scrollHeight="calc(100vh - 320px)"
            autoLayout
            showGridlines
            frozenHeader
            paginator
            size="small"
            :lazy="true"
            :rows="rowsPerPage"
            :totalRecords="totalRecords"
            :loading="loading"
            :rowsPerPageOptions="[5, 10, 25, 50, 100]"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            currentPageReportTemplate="{first} - {last} / {totalRecords}"
            @page="onPage"
            @sort="handleSort"
        >
            <!-- Header s ikonou nastavení -->
            <template #header>
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center justify-start">
                        <Settings
                            :all-columns="allColumns"
                            :definition-id="definition?.id"
                            @update:visibleColumns="visibleColumns = $event"
                        />

                        <FiltersToolbar
                            :saved-filters="savedFilters"
                            v-model:selectedFilter="selectedFilter"
                            v-model:newFilterName="newFilterName"
                            :show-clear-all="showClearAll"
                            @save-filter="saveFilter"
                            @load-filter="loadFilter"
                            @delete-filter="deleteFilter"
                            @clear-all-filters="clearAllFilters"
                        />

                        <Button
                            v-if="selectedOperations.length"
                            icon="pi pi-trash"
                            severity="danger"
                            class="ml-2"
                            v-tooltip.bottom="t('default.bulkDelete')"
                            @click="handleBulkDelete"
                        />
                    </div>
                    <Router-Link :to="{ name: ROUTE_NAMES.newOperationPage }">
                        <Button
                            icon="pi pi-plus"
                            severity="primary"
                            v-tooltip.bottom="t('operations.create')"
                        />
                    </Router-Link>
                </div>
            </template>

            <!-- Checkbox stĺpec -->
            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <!-- Akčný stĺpec -->
            <Column
                :header="t('default.actions')"
                headerStyle="width: 8rem"
                bodyStyle="text-align:center"
            >
                <template #body="slotProps">
                    <div class="flex items-center">
                        <TableActions
                            :id="slotProps.data.id"
                            :show-copy="true"
                            :show-edit="true"
                            :show-delete="true"
                            :copy-tooltip="t('default.copy')"
                            :edit-tooltip="t('default.edit')"
                            :delete-tooltip="t('default.delete')"
                            @delete="handleDelete"
                            @edit="handleEdit"
                            @copy="handleCopy"
                        >
                            <template #default>
<!--                                <RunScript-->
<!--                                    :definition-id="definition?.id"-->
<!--                                    :operation="slotProps.data"-->
<!--                                />-->
                            </template>
                        </TableActions>
                    </div>
                </template>
            </Column>

            <!-- Len viditeľné stĺpce -->
            <Column
                v-for="col in visibleColumns"
                :key="col.name"
                :field="col.name"
                style="width: auto"
                sortable
            >
                <!-- custom header s filtrovacou ikonou -->
                <template #header>
                    <div class="flex items-center justify-between gap-2">
                        <!-- ak je filter aktívny, span dostane font-bold -->
                        <span :class="{ 'font-bold': isFilterActive(col.name) }">
                            {{ col.displayName }}
                        </span>

                        <Button
                            v-if="col.name !== 'id'"
                            icon="pi pi-filter"
                            class="p-button-text p-button-sm"
                            :iconClass="isFilterActive(col.name) ? 'text-red-600' : ''"
                            @click="openFilter(col, $event)"
                        />
                    </div>
                </template>

                <template #body="slotProps">
                    <!-- skrátené ID -->
                    <span v-if="col.name === 'id'">
                        {{ shortId(slotProps.data[col.name]) }}
                    </span>

                    <!-- dátumy -->
                    <span
                        v-else-if="('isDate' in col && col.isDate) || dateFields.includes(col.name)"
                    >
                        {{
                            formatDate(
                                slotProps.data[col.name] ?? slotProps.data.content?.[col.name]
                            )
                        }}
                    </span>

                    <!-- čísla -->
                    <span
                        class="text-right w-full block"
                        v-else-if="
                            ('isNumber' in col && col.isNumber) || numberFields.includes(col.name)
                        "
                    >
                        <!--                        TODO FIXME PKL -->
                        {{
                            $n(
                                Number.isFinite(
                                    slotProps.data[col.name] ?? slotProps.data.content?.[col.name]
                                )
                                    ? (slotProps.data[col.name] ??
                                          slotProps.data.content?.[col.name])
                                    : 0,
                                'decimal'
                            )
                        }}
                    </span>

                    <!-- booleany -->
                    <span
                        v-else-if="
                            ('isBoolean' in col && col.isBoolean) ||
                            booleanFields.includes(col.name)
                        "
                    >
                        {{
                            formatBoolean(
                                slotProps.data[col.name] ?? slotProps.data.content?.[col.name]
                            )
                        }}
                    </span>

                    <!-- accounts -->
                    <span v-else-if="accountReferenceFields.includes(col.name)">
                        {{ slotProps.data[`${col.name}_name`] }}
                    </span>

                    <!-- operations -->
                    <span v-else-if="operationReferenceFields.includes(col.name)">
                        {{ slotProps.data[`${col.name}_name`] }}
                    </span>

                    <!-- fallback -->
                    <span v-else>
                        {{ slotProps.data[col.name] ?? slotProps.data.content?.[col.name] ?? '' }}
                    </span>
                </template>
            </Column>
        </DataTable>
    </div>

    <div v-else-if="loading">{{ t('default.loading') }}</div>

    <FiltersOverlay
        ref="filterPopup"
        :filters="filters"
        :active-column="activeColumn"
        v-model:localValue="localValue"
        :operators="operators"
        :reference-options="referenceOptions"
        :get-column-type="getColumnType"
        @apply-filter="applyFilter"
        @clear-filter="clearFilter"
    />

    <div class="text-sm">
        {{ t('default.selected') }}
        <span class="font-semibold">{{ selectedOperations.length }}</span>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useDefinitionsStore } from '@/stores/useDefinitionsStore';
import { useOperationsStore } from '@/stores/useOperationsStore';
import { useI18n } from 'vue-i18n';
import { useAlert } from '@/composables/useAlert';
import { formatDate } from '@/helpers/formatDate';
import { formatBoolean } from '@/helpers/formatBoolean';
import { shortId } from '@/helpers/shortId';
import { useOperationColumns } from '@/composables/operations/columnFields';
import { usePaginatedTable } from '@/composables/usePaginatedTable';
import type { FetchParams, FetchResult } from '@/types/global';
import type { ColumnDef } from '@/types/operations/columns';
import { useDeleteConfirm } from '@/composables/useDeleteConfirm';
import { useFilters } from '@/composables/operations/useFilters';
import { ROUTE_NAMES } from '@/router/names';
import { useActiveDefinition } from '@/composables/operations/useActiveDefinition';
import { useScriptsStore } from '@/stores/useScriptsStore';
import { useAccountsStore } from '@/stores/accountsStore';

const { t } = useI18n();
const route = useRoute();
const definitionStore = useDefinitionsStore();
const operationsStore = useOperationsStore();
const { error, success } = useAlert();
const { savedFilters } = storeToRefs(operationsStore);
const { confirmDelete } = useDeleteConfirm();
const { definition } = useActiveDefinition();
const router = useRouter();
const scriptStore = useScriptsStore();
const accountsStore = useAccountsStore();

//Paginácia composable
const {
    data: operationValue,
    totalRecords,
    loading,
    rowsPerPage,
    fetchData,
    onPage,
    handleSort,
    filters: tableFilters
} = usePaginatedTable(
    async (params: FetchParams): Promise<FetchResult<any>> => {
        const response = await operationsStore.fetchAllOperations(
            params.page,
            params.size,
            //@ts-ignore
            params.filters,
            params.sorting,
            definition.value?.id
        );

        return {
            items: response.content,
            total: response.total
        };
    },
    { field: 'createdTimestamp', direction: -1 }
);

const {
    dateFields,
    numberFields,
    booleanFields,
    staticColumns,

    accountReferenceFields,
    operationReferenceFields,
    getColumnType,
    dynaProps
} = useOperationColumns(definition);

const {
    filterPopup,
    activeColumn,
    filters,
    localValue,
    showClearAll,
    selectedFilter,
    newFilterName,
    operators,
    referenceOptions,
    openFilter,
    applyFilter,
    clearFilter,
    saveFilter,
    deleteFilter,
    loadFilter,
    clearAllFilters,
    isFilterActive
} = useFilters({
    dynaProps,
    operationsStore,
    tableFilters,
    t,
    confirmDelete,
    definition,
    success,
    error
});

const selectedOperations = ref<any[]>([]);
const visibleColumns = ref<ColumnDef[]>([]);

const allColumns = computed(() => {
    if (!definition.value?.model) return staticColumns.value;

    return [
        ...staticColumns.value,
        ...Object.values(definition.value.model.dynaProperties)
            .filter((prop: any) => prop.name !== 'name')
            .map((prop: any) => ({
                ...prop,
                displayName: prop.displayName || prop.name // fallback
            }))
    ];
});

onMounted(async () => {
    try {
        await scriptStore.fetchAllScripts();
        await accountsStore.fetchAllAccounts();
        await operationsStore.fetchReferencedOperationsForDefinition(definition.value);
        if (!definition.value) {
            await definitionStore.fetchDefinitionById(route.params.id as string);
        }
        await fetchData();
        if (definition.value?.id) {
            await operationsStore.fetchAllFilters(definition.value.id); // 👈 tu
        }
    } catch (err: any) {
        console.error(err);
        error(t('default.error'), t('default.errorMessage'));
    } finally {
        loading.value = false;
    }
});

watch(definition, async (newDef) => {
    if (!newDef) return;

    try {
        clearAllFilters();
        selectedFilter.value = null;
        // načítaj dáta pre novú definíciu
        await fetchData();
        if (newDef.id) {
            await operationsStore.fetchAllFilters(newDef.id); // 👈 a tu
        }
    } catch (err: any) {
        console.error(err);
        error(t('default.error'), t('default.errorMessage'));
    }
});

// computed getter na dáta do tabuľky (účty + operácie)
const operationValueWithRefs = computed(() => {
    if (!definition.value?.model?.dynaProperties) return operationValue.value;

    return operationValue.value.map((op) => {
        const copy = { ...op };

        // účty
        for (const field of accountReferenceFields.value) {
            const id = op[field] ?? op.content?.[field];
            if (id) {
                copy[`${field}_name`] = accountsStore.getAccountName(id);
            }
        }

        // operácie
        for (const field of operationReferenceFields.value) {
            const id = op[field] ?? op.content?.[field];
            if (id) {
                const refDefId =
                    definition.value?.model?.dynaProperties?.[field]?.details?.entityFilter
                        ?.parameters?.operationDefinition?.value;

                if (refDefId) {
                    copy[`${field}_name`] = operationsStore.getOperationName(id, refDefId);
                } else {
                    copy[`${field}_name`] = id;
                }
            }
        }

        return copy;
    });
});

const handleDelete = async (id: string) => {
    confirmDelete(async () => {
        try {
            await operationsStore.deleteOperation(id);
            await fetchData();
        } catch {
            error(t('default.error'), t('default.errorMessage'));
        }
    }, id);
};

const handleBulkDelete = async () => {
    if (!selectedOperations.value.length) return;

    const ids = selectedOperations.value.map((op) => op.id);

    confirmDelete(async () => {
        try {
            for (const id of ids) {
                await operationsStore.deleteOperation(id);
            }
            await fetchData();
            selectedOperations.value = [];
        } catch (err) {
            error(t('default.error'), t('default.errorMessage'));
        }
    }, ids);
};

const handleEdit = (operationId: string) => {
    router.push({
        name: ROUTE_NAMES.operationEditPage,
        params: {
            definitionId: definition.value?.id,
            operationId
        }
    });
};
const handleCopy = (operationId: string) => {
    router.push({
        name: ROUTE_NAMES.copyOperationPage,
        params: {
            definitionId: definition.value?.id,
            operationId
        }
    });
};
</script>
