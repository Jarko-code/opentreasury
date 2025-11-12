<template>
    <div v-if="definition" class="text-md my-1">
        {{ t('operations.form.new') }} {{ definition.name }}
    </div>
    <OperationForm
        :formModel="formModel"
        submitIcon="pi pi-plus"
        :submitLabel="t('default.submit')"
        :showAudit="false"
        @submit="handleSubmit"
    />
</template>

<script setup lang="ts">
import { useActiveDefinition } from '@/composables/operations/useActiveDefinition';
import { onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useOperationSaveHandler } from '@/composables/operations/useOperationSaveHandler';
import { storeToRefs } from 'pinia';
import { useOperationsStore } from '@/stores/useOperationsStore.ts';
import {
    SCRIPT_RESULTS_ACTIONS,
    type ScriptResult,
    type ScriptResultAction
} from '@/types/script-results.ts';
import { useScriptsStore } from '@/stores/useScriptsStore.ts';
import { useOperations } from '@/composables/operations/useOperations.ts';

const { t } = useI18n();
const { definition } = useActiveDefinition();
const { handleSave } = useOperationSaveHandler(definition);

const formModel = reactive<Record<string, any>>({
    source: 'frontend'
});

const handleSubmit = (data: { valid: boolean; values: Record<string, any> }) => {
    return handleSave(data, { mode: 'new' });
};

const operationStore = useOperationsStore();
const { setOperationFromScript } = operationStore;
const { operationFromScript } = storeToRefs(operationStore);

onMounted(async () => {
    if (definition.value?.defaultsScript) {
        await runScript(definition.value?.defaultsScript);
    }

    Object.assign(formModel, {
        ...operationFromScript.value
    });
    setOperationFromScript({});
});
//TODO pousteni skriptu uz se resit na tretim miste !!!!
const scriptStore = useScriptsStore();

async function runScript(scriptId: string) {
    const values = {
        action: 'REQUESTED',
        payload: { content: { amount: 1 } }
    };

    try {
        const result = (await scriptStore.runSync(scriptId, values)) as ScriptResult;
        handleScriptFinished(result);
    } catch (err) {
        console.error('Script run failed:', err);
    }
}

function handleScriptFinished(result: ScriptResult) {
    if (result.action) {
        const handler = ACTION_HANDLERS[result.action];
        if (handler && result.payload) {
            handler(result.payload);
        }
    }
}

const { adjustOperation } = useOperations();

const ACTION_HANDLERS: Partial<Record<ScriptResultAction, (input: Record<string, any>) => void>> = {
    [SCRIPT_RESULTS_ACTIONS.DEFAULTS]: (payload: Record<string, any>) => {
        Object.assign(formModel, {
            ...formModel,
            ...adjustOperation(definition.value!, payload)
        });
    }
};
</script>
