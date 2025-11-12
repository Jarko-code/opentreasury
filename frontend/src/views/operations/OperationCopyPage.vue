<template>
    <BackButton severity="secondary" :label="t('default.back')" />
    <div v-if="definition" class="text-xl my-3">
        {{ t('operations.form.copy') }} {{ operation.name }}
    </div>
    <OperationForm
        ref="operationFormRef"
        :formModel="formModel"
        :definition="definition"
        submitIcon="pi pi-copy"
        :submitLabel="t('default.submit')"
        :showAudit="true"
        @submit="handleCopy"
    />
</template>

<script setup lang="ts">
import { useOperationsStore } from '@/stores/useOperationsStore';
import { storeToRefs } from 'pinia';
import {  onMounted, reactive,  ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useDefinitionsStore } from '@/stores/useDefinitionsStore';
import { useOperationSaveHandler } from '@/composables/operations/useOperationSaveHandler';
import { useOperationLoader } from '@/composables/operations/useOperationLoader';
import { useActiveDefinition } from '@/composables/operations/useActiveDefinition';

const { t } = useI18n();
const route = useRoute();
const operationsStore = useOperationsStore();
const definitionsStore = useDefinitionsStore();
const { definition } = useActiveDefinition();
const { operation } = storeToRefs(operationsStore);
const { handleSave } = useOperationSaveHandler(definition);
const { loadOperation, loading } = useOperationLoader();

const formModel = reactive<Record<string, any>>({});
const operationFormRef = ref();

const setFormValues = (newVal: any) => {
    operationFormRef.value?.setValues({
        name: newVal.name
    });
};

onMounted(async () => {
    const operationId = route.params.operationId as string;
    try {
        await loadOperation(operationId, formModel);

        if (operation.value && operationFormRef.value?.setValues) {
            setFormValues(operation.value);
        }
    } catch (err) {
        console.error(err);
    }
});

const handleCopy = (data: { valid: boolean; values: Record<string, any> }) => {
    return handleSave(data, { mode: 'clone' });
};
</script>
