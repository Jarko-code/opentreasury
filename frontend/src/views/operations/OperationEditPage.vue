<template>
    <!--    <BackButton severity="secondary" :label="t('default.back')" />-->
    <div v-if="definition" class="flex flex-row items-center text-xl">
        <div class="flex grow">{{ t('operations.form.edit') }} {{ formModel.name }}</div>
        <div class="flex justify-end">
            <RunScript
                :definition-id="operation?.operationDefinition"
                :operation="formModel"
                @finished="handleScriptFinished"
            />
        </div>
    </div>
    <OperationForm
        ref="operationFormRef"
        :formModel="formModel"
        :invalid-inputs="invalidInputs"
        submitIcon="pi pi-save"
        :submitLabel="t('default.save')"
        :showOperationLinks="true"
        :key="route.params.operationId"
        @value-updated="handleValueUpdated"
        @submit="handleUpdate"
    />
</template>

<script setup lang="ts">
import { useOperationsStore } from '@/stores/useOperationsStore';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, toRaw, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useAlert } from '@/composables/useAlert';
import { useUserStore } from '@/stores/user-store';
import { useAuthStore } from '@/stores/auth';
import { useOperationLoader } from '@/composables/operations/useOperationLoader';
import { useOperationLinkDefinitionsStore } from '@/stores/useOperationLinkDefinitionsStore';
import { useScriptsStore } from '@/stores/useScriptsStore';
import {
    SCRIPT_RESULTS_ACTIONS,
    type ScriptResult,
    type ScriptResultAction
} from '@/types/script-results.ts';
import { useActiveDefinition } from '@/composables/operations/useActiveDefinition.ts';
import { useOperations } from '@/composables/operations/useOperations.ts';
import { ROUTE_NAMES } from '@/router/names.ts';
import RunScript from '@/components/operations/RunScript.vue';

const scriptsStore = useScriptsStore();

const route = useRoute();
const { t } = useI18n();
const operationsStore = useOperationsStore();
const { setOperationFromScript } = operationsStore;
const { operation } = storeToRefs(operationsStore);
const { definition } = useActiveDefinition();
const { success, error } = useAlert();
const userStore = useUserStore();
const router = useRouter();
const authStore = useAuthStore();
const { actualUsername } = authStore;
const { loadOperation } = useOperationLoader();
const operationLinkDefinitionsStore = useOperationLinkDefinitionsStore();

const formModel = reactive<Record<string, any>>({});
const operationFormRef = ref();
const invalidInputs = ref<Array<InputValidationFromScript>>([]);

const setFormValues = (newVal: any) => {
    operationFormRef.value?.setValues({
        name: newVal.name
    });
};

onMounted(async () => {
    const operationId = route.params.operationId as string;
    try {
        await scriptsStore.fetchAllScripts();

        await loadOperation(operationId, formModel);

        if (operation.value && operationFormRef.value?.setValues) {
            setFormValues(operation.value);
        }
    } catch (err) {
        console.error(err);
    }
});

// zabezpeci ukladanie linkovanych operacii
const handleOperationLinksUpdate = async (operationId: string) => {
    try {
        const selectedLinks = operationFormRef.value?.getOperationLinks?.();

        if (!selectedLinks) {
            console.warn('No links found');
            return;
        }

        const allEntries = Object.entries(selectedLinks);

        for (const [definitionId, selectedValue] of allEntries) {
            const existingLink = operationLinkDefinitionsStore.operationLinks.find(
                (l) => l.linkDefinition === definitionId
            );

            // Scenár 1: neexistuje pôvodný link a má sa pridať nový
            if (!existingLink && selectedValue !== 'NA') {
                const payload = {
                    linkDefinition: definitionId,
                    primarySide: selectedValue as string,
                    secondarySide: operationId
                };

                try {
                    await operationLinkDefinitionsStore.saveOperationLink(payload);
                } catch (err) {
                    console.error('Create error:', err);
                }
            }

            // Scenár 2: existuje link, ale vybral inú operáciu
            else if (
                existingLink &&
                existingLink.primarySide !== selectedValue &&
                selectedValue !== 'NA'
            ) {
                const newPayload = {
                    linkDefinition: definitionId,
                    primarySide: selectedValue as string,
                    secondarySide: operationId
                };

                try {
                    await operationLinkDefinitionsStore.deleteOperationLink(existingLink.id);
                    await operationLinkDefinitionsStore.saveOperationLink(newPayload);
                } catch (err) {
                    console.error('Delete + create error:', err);
                }
            }

            // Scenár 3: existuje link, ale vybral „N/A“
            else if (existingLink && selectedValue === 'NA') {
                try {
                    await operationLinkDefinitionsStore.deleteOperationLink(existingLink.id);
                } catch (err) {
                    console.error('Delete error:', err);
                }
            }
        }
    } catch (err) {
        console.error('handleOperationLinksUpdate error:', err);
    }
};

const handleUpdate = async ({ valid }: { valid: boolean; values: Record<string, any> }) => {
    if (!valid) return;

    const raw = toRaw(formModel);
    const { name, source, actualStatus, ...dynaProps } = raw;

    const operationId = route.params.operationId as string;

    const payload = {
        id: operationId,
        name,
        creator: operation.value.creator || actualUsername,
        updatedBy: actualUsername,
        source: source || 'frontend',
        actualStatus: !actualStatus || actualStatus.toLowerCase() === 'n/a' ? null : actualStatus,
        operationDefinition: operation.value.operationDefinition ?? '',
        securityGroup: userStore.currentSecurityGroupId || undefined,
        createdTimestamp: operation.value.createdTimestamp,
        updatedTimestamp: operation.value.updatedTimestamp,
        content: { ...dynaProps }
    };

    // console.log('Updating payload:', payload);

    try {
        const updated = await operationsStore.updateOperation(payload);

        if (updated) {
            await handleOperationLinksUpdate(operationId);
            success(t('default.saved'), t('operations.form.updated'));
            router.go(-1);
        } else {
            error(t('default.failed'), t('operations.form.updateFailed'));
        }
    } catch (err) {
        console.error('Error while updating operation:', err);
        error(t('default.failed'), t('operations.form.updateFailed'));
    }
};
watch(
    () => route.params.operationId,
    async (newId, oldId) => {
        if (!newId || newId === oldId) return;
        // console.log('Re-loading operation', newId);

        try {
            await loadOperation(newId as string, formModel);

            if (operation.value && operationFormRef.value?.setValues) {
                setFormValues(operation.value);
            }
        } catch (err) {
            console.error('Failed to reload operation after route param change:', err);
        }
    }
);

const { adjustOperation } = useOperations();

type ActionHandler =
    | ((payload: Record<string, any>) => void)
    | ((payload: Array<InputValidationFromScript>) => void);

const ACTION_HANDLERS: Partial<Record<ScriptResultAction, ActionHandler>> = {
    [SCRIPT_RESULTS_ACTIONS.CREATE_NEW]: (payload: Record<string, any>) => {
        payload.id = undefined;
        payload.name = undefined;

        setOperationFromScript(adjustOperation(definition.value!, payload));

        router.push({
            name: ROUTE_NAMES.newOperationPage,
            params: {
                id: payload.operationDefinition ?? definition.value?.id
            }
        });
    },
    [SCRIPT_RESULTS_ACTIONS.MODIFY_CURRENT]: updateFunction,
    [SCRIPT_RESULTS_ACTIONS.VALIDATION_ERROR]: (payload: Array<InputValidationFromScript>) => {
        Object.assign(invalidInputs.value, payload);
    }
};

function updateFunction(payload: Record<string, any>) {
    const newFormModel = {
        ...operation.value,
        ...adjustOperation(definition.value!, payload)
    };

    Object.assign(formModel, {
        ...newFormModel
    });
}

export interface InputValidationFromScript {
    field: string;
    message: string;
}

function handleScriptFinished(result: ScriptResult) {
    if (result.action) {
        const handler = ACTION_HANDLERS[result.action];
        if (handler && result.payload) {
            handler(result.payload);
        }
    }
}

async function handleValueUpdated(payload: {
    field: { name: string; recalculationScripts?: Array<string> };
}) {
    const { field } = payload;

    if (field.recalculationScripts?.length) {
        for (const recalculationScriptId of field.recalculationScripts) {
            await runScript(recalculationScriptId);
        }
    }
}

const scriptStore = useScriptsStore();

async function runScript(scriptId: string) {
    const cleanedOperation = Object.fromEntries(
        Object.entries(formModel).filter(([key]) => !key.endsWith('_name'))
    );

    const values = {
        action: 'REQUESTED',
        payload: { content: { ...cleanedOperation } }
    };

    try {
        const result = (await scriptStore.runSync(scriptId, values)) as ScriptResult;
        handleScriptFinished(result);
    } catch (err) {
        console.error('Script run failed:', err);
    }
}
</script>
