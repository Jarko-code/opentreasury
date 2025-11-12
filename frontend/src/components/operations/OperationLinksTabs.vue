<template>
    <Tabs v-if="showOperationLinks && operationLinks.length" value="0" class="mt-6">
        <TabList>
            <Tab value="0">{{ t('operations.form.operationLinks') }}</Tab>
            <!-- Dynamické taby pre ľavú stranu -->
            <Tab
                v-for="(def, index) in outgoingLinkDefinitions"
                :key="`outgoing-tab-${def.id}`"
                :value="`${index + 1}`"
            >
                {{ def.secondarySideName }}
            </Tab>
        </TabList>

        <TabPanels>
            <TabPanel value="0">
                <div class="p-4">
                    <div v-if="filteredOperationLinkDefinitions.length === 0" class="text-sm">
                        {{ t('operations.form.nooperationLinks') }}
                    </div>

                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div
                            v-for="definition in filteredOperationLinkDefinitions"
                            :key="definition.id"
                            class="flex flex-col space-y-2"
                        >
                            <FloatLabel class="w-full" variant="on">
                                <Select
                                    v-model="selectedLinks[definition.id ?? '']"
                                    :id="definition.name"
                                    :options="getAvailableOperations(definition)"
                                    optionLabel="name"
                                    optionValue="id"
                                    class="w-full"
                                />
                                <label :for="definition.name">
                                    {{ getSideName(definition) }}
                                </label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
            </TabPanel>

            <!-- Ľavé strany -->
            <TabPanel
                v-for="(def, index) in outgoingLinkDefinitions"
                :key="`left-panel-${def.id}`"
                :value="`${index + 1}`"
            >
                <div class="p-4">
                    <div class="flex items-center justify-between mb-3">
                        <div class="text-base font-medium">
                            {{ def.primarySideName }}
                        </div>
                        <Button
                            icon="pi pi-plus"
                            severity="primary"
                            v-tooltip.bottom="t('operations.create')"
                            @click="() => handleAddLinkedOperation(def)"
                        />
                    </div>

                    <DataTable
                        :value="getLinkedOperationsForLeftSide(def)"
                        scrollable
                        showGridlines
                        autoLayout
                        style="min-width: 50rem"
                    >
                        <!-- Akčný stĺpec -->
                        <Column
                            :header="t('default.actions')"
                            headerStyle="width: 6rem"
                            bodyStyle="text-align:center"
                        >
                            <template #body="slotProps">
                                <TableActions
                                    :id="slotProps.data.id"
                                    :show-copy="true"
                                    :show-edit="true"
                                    :show-delete="true"
                                    :edit-tooltip="t('default.edit')"
                                    :copy-tooltip="t('default.copy')"
                                    :delete-tooltip="t('default.unlink')"
                                    @copy="() => handleCopyLinked(slotProps.data.id, def)"
                                    @edit="() => handleEditLinked(slotProps.data.id, def)"
                                    @delete="() => handleDeleteLinked(slotProps.data.id, def)"
                                />
                            </template>
                        </Column>

                        <!-- Dynamické stĺpce -->
                        <Column
                            v-for="col in getColumnsForDefinition(def)"
                            :key="col.name"
                            :field="col.name"
                            :header="col.displayName || col.name"
                            style="width: auto"
                        >
                            <template #body="slotProps">
                                <!-- skrátené ID -->
                                <span v-if="col.name === 'id'">
                                    {{ shortId(slotProps.data[col.name]) }}
                                </span>

                                <!-- dátumy -->
                                <span
                                    v-else-if="
                                        ('isDate' in col && col.isDate) ||
                                        dateFields.includes(col.name)
                                    "
                                >
                                    {{
                                        formatDate(
                                            slotProps.data[col.name] ??
                                                slotProps.data.content?.[col.name]
                                        )
                                    }}
                                </span>

                                <!-- čísla -->
                                <span
                                    class="text-right w-full block"
                                    v-else-if="
                                        ('isNumber' in col && col.isNumber) ||
                                        numberFields.includes(col.name)
                                    "
                                >
                                    <!--                        TODO FIXME PKL -->
                                    {{
                                        $n(
                                            Number.isFinite(
                                                slotProps.data[col.name] ??
                                                    slotProps.data.content?.[col.name]
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
                                            slotProps.data[col.name] ??
                                                slotProps.data.content?.[col.name]
                                        )
                                    }}
                                </span>

                                <!-- accounts -->
                                <span v-else-if="accountReferenceFields.includes(col.name)">
                                    {{
                                        accountNames[
                                            slotProps.data[col.name] ??
                                                slotProps.data.content?.[col.name]
                                        ] ??
                                        slotProps.data[col.name] ??
                                        slotProps.data.content?.[col.name]
                                    }}
                                </span>

                                <!-- operations -->
                                <span v-else-if="operationReferenceFields.includes(col.name)">
                                    {{
                                        operationNames[
                                            slotProps.data[col.name] ??
                                                slotProps.data.content?.[col.name]
                                        ] ??
                                        slotProps.data[col.name] ??
                                        slotProps.data.content?.[col.name]
                                    }}
                                </span>

                                <!-- fallback -->
                                <span v-else>
                                    {{
                                        slotProps.data[col.name] ??
                                        slotProps.data.content?.[col.name] ??
                                        ''
                                    }}
                                </span>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </TabPanel>
        </TabPanels>
    </Tabs>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted, reactive, computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useOperationLinkDefinitionsStore } from '@/stores/useOperationLinkDefinitionsStore';
import { useOperationsStore } from '@/stores/useOperationsStore';
import { useDefinitionsStore } from '@/stores/useDefinitionsStore';
import { formatDate } from '@/helpers/formatDate';
import { formatBoolean } from '@/helpers/formatBoolean';
import { shortId } from '@/helpers/shortId';
import { useOperationColumns } from '@/composables/operations/columnFields';
import { useActiveDefinition } from '@/composables/operations/useActiveDefinition';
import { useReferenceNames } from '@/composables/operations/useReferenceNames';
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '@/router/names';
import { useConfirmOperation } from '@/composables/useConfirmOperation';
import { useAlert } from '@/composables/useAlert';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const operationLinkDefinitionsStore = useOperationLinkDefinitionsStore();
const operationsStore = useOperationsStore();
const definitionStore = useDefinitionsStore();
const { confirmOperation } = useConfirmOperation();
const { error } = useAlert();

const { operationLinks, operationLinkDefinitions } = storeToRefs(operationLinkDefinitionsStore);
const { operations } = storeToRefs(operationsStore);
const { definition } = useActiveDefinition();
const {
    dateFields,
    numberFields,
    booleanFields,
    accountReferenceFields,
    operationReferenceFields,
    staticColumns,
    dynaProps
} = useOperationColumns(definition);

// lokálny zoznam všetkých operácií (kombinovaný z oboch strán)
const allLinkedOperations = reactive<{ id: string; name: string; operationDefinition: string }[]>(
    []
);

const { accountNames, operationNames } = useReferenceNames(
    allLinkedOperations,
    accountReferenceFields,
    operationReferenceFields
);

const props = defineProps({
    showOperationLinks: { type: Boolean, default: false }
});

defineExpose({
    getOperationLinks: () => selectedLinks
});

const selectedLinks = reactive<Record<string, string>>({});
const definitionId = computed(() => route.params.definitionId as string);
const currentOperationId = computed(() => route.params.operationId as string);

// filter pre linkovene operacie
const filteredOperationLinkDefinitions = computed(() => {
    const defs = operationLinkDefinitions.value;
    const defId = definitionId.value;
    if (!defId || !Array.isArray(defs)) return [];

    const relevant = defs.filter((def) => {
        const isPrimary = def.primaryOperationDefinitions?.includes(defId);
        const isSecondary = def.secondaryOperationDefinitions?.includes(defId);

        if (isPrimary && isSecondary) return true;
        if (isPrimary && !isSecondary) return false;
        if (isSecondary && !isPrimary) return true;

        return false;
    });

    return relevant;
});

// načítanie operácií pre všetky relevantné definície
const fetchLinkedOperationsForBothSides = async (defId: string) => {
    const linkDefs = operationLinkDefinitions.value;
    if (!Array.isArray(linkDefs)) return;

    // zber všetkých definícií, ktoré majú túto ako primary alebo secondary
    const relatedDefinitionIds = new Set<string>();

    linkDefs.forEach((def) => {
        if (def.primaryOperationDefinitions?.includes(defId)) {
            def.secondaryOperationDefinitions?.forEach((sid: string) =>
                relatedDefinitionIds.add(sid)
            );
        }
        if (def.secondaryOperationDefinitions?.includes(defId)) {
            def.primaryOperationDefinitions?.forEach((pid: string) =>
                relatedDefinitionIds.add(pid)
            );
        }
    });

    // pridaj aj aktuálnu definíciu
    relatedDefinitionIds.add(defId);

    const allOps: any[] = [];

    for (const relatedId of relatedDefinitionIds) {
        try {
            //správne volanie podľa store
            const result = await operationsStore.fetchAllOperations(
                0,
                1000,
                {},
                undefined,
                relatedId
            );

            allOps.push(...(result.content || []));
        } catch (err) {
            console.error(`Definition load error ${relatedId}:`, err);
        }
    }

    // odstránime duplikáty
    const unique = allOps.filter(
        (op, index, self) => index === self.findIndex((o) => o.id === op.id)
    );

    allLinkedOperations.splice(0, allLinkedOperations.length, ...unique);
};

// helper pre spravne pomenovanie pravej/lavej strany
const getSideName = (definition: any) => {
    const currentId = definitionId.value;

    const isPrimary = definition.primaryOperationDefinitions?.includes(currentId);
    const isSecondary = definition.secondaryOperationDefinitions?.includes(currentId);

    if (isPrimary && !isSecondary) {
        // ak sme na primary strane (napr. Úvěr), ukáž secondary name (Úrok)
        return definition.secondarySideName;
    }

    if (isSecondary && !isPrimary) {
        // ak sme na secondary strane (napr. Úrok), ukáž primary name (Úvěr)
        return definition.primarySideName;
    }

    // self-link (napr. Úrok–Úrok)
    if (isPrimary && isSecondary) {
        return definition.primarySideName;
    }

    return 'Linked operation not found';
};

// kombinovaný fetch všetkých relevantných operation-links
async function fetchAllRelatedOperationLinks(operationId: string, definitionId: string) {
    const defs = operationLinkDefinitions.value;
    const relatedDefIds = new Set<string>();

    defs.forEach((def) => {
        if (
            def.primaryOperationDefinitions?.includes(definitionId) ||
            def.secondaryOperationDefinitions?.includes(definitionId)
        ) {
            if (def.id) {
                relatedDefIds.add(def.id);
            }
        }
    });

    const allLinks: any[] = [];

    // fetchni všetky linky pre dané definície
    for (const defId of relatedDefIds) {
        const result =
            await operationLinkDefinitionsStore.fetchOperationLinksByLinkDefinitionId(defId);
        allLinks.push(...(result || []));
    }

    // fetchni aj linky priamo pre túto operáciu
    const directLinks =
        await operationLinkDefinitionsStore.fetchOperationLinksByOperationId(operationId);
    allLinks.push(...directLinks);

    // odstráň duplicity
    const uniqueLinks = allLinks.filter(
        (link, index, self) => index === self.findIndex((l) => l.id === link.id)
    );

    operationLinkDefinitionsStore.operationLinks = uniqueLinks;
    // console.log('Related operation links loaded:', uniqueLinks);
}

onMounted(async () => {
    if (!props.showOperationLinks) return;

    const operationId = currentOperationId.value;
    const defId = definitionId.value;
    if (!operationId || !defId) return;

    try {
        // Načítaj definície
        await operationLinkDefinitionsStore.fetchAllOperationLinkDefinitions();

        // Načítaj všetky relevantné linky (nie len tie priamo pripojené)
        await fetchAllRelatedOperationLinks(operationId, defId);

        // Načítaj operácie pre všetky prepojené definície
        await fetchLinkedOperationsForBothSides(defId);

        // Predvyplň selecty
        filteredOperationLinkDefinitions.value.forEach((def) => {
            const link = operationLinks.value.find((l) => l.linkDefinition === def.id);

            const isPrimary = def.primaryOperationDefinitions?.includes(definitionId.value);
            const isSecondary = def.secondaryOperationDefinitions?.includes(definitionId.value);

            if (isPrimary && !isSecondary) {
                selectedLinks[def.id as string] = link?.secondarySide || 'NA';
            } else if (isSecondary && !isPrimary) {
                selectedLinks[def.id as string] = link?.primarySide || 'NA';
            } else {
                selectedLinks[def.id as string] = link?.primarySide || 'NA';
            }
        });

        await definitionStore.fetchAllDefinitions();
    } catch (err) {
        console.error('Failed to load operation link data:', err);
    }
});

// helper pre spravne nacitanie operacii do selectu
const getAvailableOperations = (definition: any) => {
    const currentId = definitionId.value;

    const isPrimary = definition.primaryOperationDefinitions?.includes(currentId);
    const isSecondary = definition.secondaryOperationDefinitions?.includes(currentId);

    let targetDefinitions: string[] = [];

    if (isPrimary && !isSecondary) {
        // napr. Úver → Úrok → zobraz operácie z Úroku (secondary)
        targetDefinitions = definition.secondaryOperationDefinitions || [];
    } else if (isSecondary && !isPrimary) {
        // napr. Úrok → Úver → zobraz operácie z Úveru (primary)
        targetDefinitions = definition.primaryOperationDefinitions || [];
    } else if (isPrimary && isSecondary) {
        // self-link (napr. Úver → Úver)
        targetDefinitions = definition.primaryOperationDefinitions || [];
    }

    // vyber iba operácie patriace k cieľovej definícii (opačnej strane)
    const filteredOps = allLinkedOperations.filter(
        (op) =>
            targetDefinitions.includes(op.operationDefinition) && op.id !== currentOperationId.value // vylúč aktuálnu operáciu
    );

    // pridaj N/A ako prvú možnosť
    return [{ id: 'NA', name: 'N/A' }, ...filteredOps];
};

// outgoing definitions = všetky, ktoré vychádzajú z aktuálnej definície
const outgoingLinkDefinitions = computed(() =>
    operationLinkDefinitions.value.filter((def) =>
        def.primaryOperationDefinitions?.includes(definitionId.value)
    )
);

const getLinkedOperationsForLeftSide = (definition: any) => {
    const operationId = currentOperationId.value;
    const currentDefId = definitionId.value;
    if (!operationId) return [];

    const defs = operationLinkDefinitions.value;
    const links = operationLinks.value;
    const linkedIds = new Set<string>();

    // preskoč self-linky (ale iba pre sekundárnu stranu)
    const isSelfLink =
        definition.primaryOperationDefinitions?.some((id: String) =>
            definition.secondaryOperationDefinitions?.includes(id)
        ) ?? false;

    if (isSelfLink) {
        const isPrimaryType = definition.primaryOperationDefinitions?.includes(currentDefId);
        const isSecondaryType = definition.secondaryOperationDefinitions?.includes(currentDefId);
        if (isSecondaryType && !isPrimaryType) {
            // console.groupCollapsed(
            //     `getLinkedOperationsForLeftSide("${definition.secondarySideName}")`
            // );
            // console.log('Self-link definícia (sekundárna strana), preskakujem');
            // console.groupEnd();
            return [];
        }
    }

    // Priame linky len pre definície, ktoré patria k aktuálnemu typu (napr. Urok)
    const validLinks = links.filter((l) => {
        const linkDef = defs.find((d) => d.id === l.linkDefinition);
        if (!linkDef) return false;

        // zober všetky linky, ktoré patria do tejto definície (na jednej alebo druhej strane)
        return (
            linkDef.primaryOperationDefinitions?.includes(currentDefId) ||
            linkDef.secondaryOperationDefinitions?.includes(currentDefId)
        );
    });

    for (const link of validLinks.filter((l) => l.linkDefinition === definition.id)) {
        const isPrimary = link.primarySide === operationId;
        const isSecondary = link.secondarySide === operationId;

        const defPrimaryType = definition.primaryOperationDefinitions?.includes(currentDefId);
        const defSecondaryType = definition.secondaryOperationDefinitions?.includes(currentDefId);

        if (isPrimary && defPrimaryType && !defSecondaryType) {
            linkedIds.add(link.secondarySide);
        } else if (isSecondary && defSecondaryType && !defPrimaryType) {
            linkedIds.add(link.primarySide);
        }
    }

    // susediace definície (rovnaké páry + rovnaký typ)
    const neighborDefs = defs.filter((d) => {
        if (d.id === definition.id) return false;
        if (d.primarySideName !== definition.primarySideName) return false; // filter podľa primárnej strany

        const samePrimary =
            JSON.stringify(d.primaryOperationDefinitions?.sort() || []) ===
            JSON.stringify(definition.primaryOperationDefinitions?.sort() || []);
        const sameSecondary =
            JSON.stringify(d.secondaryOperationDefinitions?.sort() || []) ===
            JSON.stringify(definition.secondaryOperationDefinitions?.sort() || []);

        return samePrimary && sameSecondary;
    });

    // prejdeme len linky susediacich definícií (už prečistených)
    for (const crossDef of neighborDefs) {
        for (const link of validLinks.filter((l) => l.linkDefinition === crossDef.id)) {
            if (link.primarySide === operationId && link.secondarySide !== operationId) {
                linkedIds.add(link.secondarySide);
            } else if (link.secondarySide === operationId && link.primarySide !== operationId) {
                linkedIds.add(link.primarySide);
            }
        }
    }

    linkedIds.delete(operationId);

    const related = allLinkedOperations.filter((o) => linkedIds.has(o.id));

    // console.groupCollapsed(`getLinkedOperationsForLeftSide("${definition.secondarySideName}")`);
    // console.log('Aktuálna operácia ID:', operationId);
    // console.log('LinkDefinition:', definition.name);
    // console.log('Linked IDs:', [...linkedIds]);
    // console.log(
    //     'Operácie:',
    //     related.map((o) => o.name)
    // );
    // console.groupEnd();

    return related;
};

const getColumnsForDefinition = (def: any) => {
    const linkedOps = getLinkedOperationsForLeftSide(def);
    const firstOp = linkedOps?.[0];
    if (!firstOp?.operationDefinition) return staticColumns.value;

    const opDef = definitionStore.definitions.find((d) => d.id === firstOp.operationDefinition);
    if (!opDef?.model?.dynaProperties) return staticColumns.value;

    const dynamic = Object.values(opDef.model.dynaProperties).map((prop: any) => {
        const type = prop.details?.type?.toUpperCase?.();
        return {
            ...prop,
            isDate: type === 'DATE' || type === 'DATETIME',
            isNumber: ['DECIMAL', 'NUMBER', 'INTEGER'].includes(type),
            isBoolean: type === 'BOOLEAN'
        };
    });

    return [...staticColumns.value, ...dynamic];
};

watch(
    () => route.fullPath,
    async (newPath, oldPath) => {
        // Ak sme sa vrátili z create stránky, refetchneme linky
        if (newPath.includes('/operations/') && !newPath.endsWith('/new')) {
            // console.log('Refreshing linked operations after returning...');
            const operationId = currentOperationId.value;
            const defId = definitionId.value;
            if (!operationId || !defId) return;

            await fetchAllRelatedOperationLinks(operationId, defId);
            await fetchLinkedOperationsForBothSides(defId);
        }
    }
);

// Handlery pre akcie
const handleAddLinkedOperation = (def: any) => {
    const currentOperationId = route.params.operationId as string | undefined;
    const linkDefId = def.id;

    // Určíme cieľovú definíciu (vždy druhá strana linku)
    const targetDefId =
        def.secondaryOperationDefinitions?.[0] || def.primaryOperationDefinitions?.[0] || '';

    if (!targetDefId) {
        console.error('No target definiton for link', def);
        return;
    }

    router
        .push({
            name: ROUTE_NAMES.newOperationPage,
            params: { id: targetDefId },
            query: {
                linkedTo: currentOperationId,
                linkDef: linkDefId
            }
        })
        .catch((err) => {
            console.error('Router push failed:', err);
        });
};

const handleCopyLinked = (id: string, def: any) => {
    const linkDefId = def.id;
    const targetDefId =
        def.secondaryOperationDefinitions?.[0] || def.primaryOperationDefinitions?.[0];

    router.push({
        name: ROUTE_NAMES.copyOperationPage,
        params: {
            definitionId: targetDefId,
            operationId: id
        },
        query: {
            linkedTo: route.params.operationId,
            linkDef: linkDefId
        }
    });
};

const handleEditLinked = (id: string, def: any) => {
    const linkedOp = allLinkedOperations.find((op) => op.id === id);
    if (!linkedOp) {
        console.warn('Linked operation not found for edit:', id);
        return;
    }

    const targetDefId = linkedOp.operationDefinition;

    router.push({
        name: ROUTE_NAMES.operationEditPage,
        params: {
            definitionId: targetDefId,
            operationId: id
        }
    });
};

const handleDeleteLinked = (id: string, def: any) => {
    const linkToDelete = operationLinkDefinitionsStore.operationLinks.find(
        (l) => l.linkDefinition === def.id && (l.primarySide === id || l.secondarySide === id)
    );

    if (!linkToDelete) {
        console.warn('No link found to delete for operation', id);
        return;
    }

    confirmOperation(
        async () => {
            try {
                await operationLinkDefinitionsStore.deleteOperationLink(linkToDelete.id);
            } catch (err) {
                console.error('Failed to delete operation link:', err);
                error(t('default.failed'), t('operations.form.linkDeleteFailed'));
            }
        }
    );
};
</script>
