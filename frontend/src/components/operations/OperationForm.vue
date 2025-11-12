<template>
    <Form
        v-slot="$form"
        :formData="formModel"
        :validateOnValueUpdate="true"
        :validateOnBlur="true"
        :resolver="
            (options) => operationResolver({ ...options, values: formModel }, internalInvalidInputs)
        "
        @submit="onSubmit"
        ref="formRef"
        class="text-xs"
    >
        <div class="flex flex-col gap-3 w-full mt-5">
            <!-- Grouped fields -->
            <div
                v-for="group in groupedContentFields"
                :key="group.key"
                class="flex flex-col w-full"
            >
                <div :class="'flex flex-row w-full gap-x-2'">
                    <div
                        v-for="field in group.fields"
                        :key="field.name"
                        class="flex flex-col w-full"
                    >
                        <FloatLabel class="w-full" variant="on">
                            <!-- STRING -->
                            <InputText
                                v-if="field.component === 'InputText'"
                                :id="field.name"
                                :name="field.name"
                                :model-value="formModel[field.name]"
                                @update:model-value="
                                    async (newValue) =>
                                        await handleUpdateInput($form, field, newValue)
                                "
                                class="w-full"
                                size="small"
                            />

                            <!-- NUMBER -->
                            <InputNumber
                                v-else-if="field.component === 'NumberInput'"
                                :id="field.name"
                                :name="field.name"
                                :model-value="formModel[field.name]"
                                @update:model-value="
                                    async (newValue) =>
                                        await handleUpdateInput($form, field, newValue)
                                "
                                class="w-full"
                                locale="cs-CZ"
                                :minFractionDigits="0"
                                :maxFractionDigits="10"
                                autocomplete="off"
                                size="small"
                            />

                            <!-- DATE -->
                            <DatePicker
                                v-else-if="field.component === 'Calendar'"
                                :id="field.name"
                                :model-value="formModel[field.name]"
                                @update:model-value="
                                    async (newValue) =>
                                        await handleUpdateInput($form, field, newValue)
                                "
                                :name="field.name"
                                fluid
                                dateFormat="dd.mm.yy"
                                size="small"
                            />

                            <!-- SELECT -->
                            <Select
                                v-else-if="field.component === 'Select'"
                                :id="field.name"
                                :name="field.name"
                                :model-value="formModel[field.name]"
                                @update:model-value="
                                    async (newValue) =>
                                        await handleUpdateInput($form, field, newValue)
                                "
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                showClear
                                filter
                                size="small"
                            />

                            <label :for="field.name">{{ field.label }}</label>
                        </FloatLabel>

                        <!-- VALIDATION -->
                        <Message
                            v-if="$form[field.name]?.invalid"
                            severity="error"
                            size="small"
                            variant="simple"
                            class="mt-1"
                        >
                            {{ $form[field.name].error.message }}
                        </Message>
                    </div>
                </div>
            </div>

            <!-- Checkboxes -->
            <div
                v-for="field in contentFields.filter((f) => f.component === 'Checkbox')"
                :key="field.name"
                class="flex flex-col justify-start"
            >
                <span class="text-xs text-surface-500 mb-1">{{ field.label }}</span>
                <Checkbox
                    :inputId="field.name"
                    :model-value="formModel[field.name]"
                    @update:model-value="
                        async (newValue) => await handleUpdateInput($form, field, newValue)
                    "
                    :binary="true"
                    class="mt-auto"
                    size="small"
                />
            </div>
        </div>
        <Accordion :value="['0']" multiple>
            <AccordionPanel value="0">
                <AccordionHeader>{{ t('operations.form.metaData') }}</AccordionHeader>
                <AccordionContent>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div v-for="field in metaFields" :key="field.name" class="w-full">
                            <!-- STRING -->
                            <template v-if="field.component === 'InputText'">
                                <FloatLabel class="w-full" variant="on">
                                    <InputText
                                        :id="field.name"
                                        :name="field.name"
                                        :model-value="formModel[field.name]"
                                        @update:model-value="
                                            async (newValue) =>
                                                await handleUpdateInput($form, field, newValue)
                                        "
                                        class="w-full"
                                        autocomplete="off"
                                        :disabled="field.disabled"
                                        size="small"
                                    />
                                    <label :for="field.name">{{ field.label }}</label>
                                </FloatLabel>
                            </template>

                            <!-- SELECT -->
                            <template v-else-if="field.component === 'Select'">
                                <FloatLabel class="w-full" variant="on">
                                    <Select
                                        :id="field.name"
                                        :model-value="formModel[field.name]"
                                        @update:model-value="
                                            async (newValue) =>
                                                await handleUpdateInput($form, field, newValue)
                                        "
                                        :options="field.options || []"
                                        optionLabel="label"
                                        optionValue="value"
                                        class="w-full"
                                        :disabled="field.disabled"
                                        size="small"
                                    />
                                    <label :for="field.name">{{ field.label }}</label>
                                </FloatLabel>
                            </template>

                            <!-- VALIDATION -->
                            <Message
                                v-if="$form[field.name]?.invalid"
                                severity="error"
                                size="small"
                                variant="simple"
                            >
                                {{ $form[field.name].error.message }}
                            </Message>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionPanel>
            <AccordionPanel v-if="showAudit" value="2">
                <AccordionHeader>{{ t('operations.form.audit') }}</AccordionHeader>
                <AccordionContent>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div v-for="field in auditFields" :key="field.name" class="w-full">
                            <FloatLabel class="w-full" variant="on">
                                <InputText
                                    :id="field.name"
                                    :name="field.name"
                                    v-model="formModel[field.name]"
                                    :value="
                                        field.isDate
                                            ? formatDate(formModel[field.name])
                                            : formModel[field.name]
                                    "
                                    class="w-full"
                                    disabled
                                    size="small"
                                />
                                <label :for="field.name">{{ field.displayName }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>

        <div v-if="true" :key="'links-wrapper' + $form?.submitting">
            <OperationLinksTabs
                v-if="!$form?.submitting"
                ref="linksTabsRef"
                :showOperationLinks="showOperationLinks"
            />
        </div>

        <div class="flex justify-end mt-6 gap-x-3">
            <Button
                type="button"
                :label="backLabel"
                :icon="backIcon"
                :loading="loading"
                severity="secondary"
                @click="handleBack"
            />
            <Button
                type="submit"
                :label="submitLabel"
                :icon="submitIcon"
                :loading="loading"
                severity="primary"
            />
        </div>
    </Form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useActiveDefinition } from '@/composables/operations/useActiveDefinition';
import { useFormController } from '@/composables/useFormController';
import { useOperationMetaFields } from '@/composables/operations/useOperationMetaFields';
import { useResolvers } from '@/composables/operations/useResolvers';
import { useOperationContentFields } from '@/composables/operations/useOperationContentFields';
import { useAccountsStore } from '@/stores/accountsStore';
import { useCurrencyStore } from '@/stores/currencyStore';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useAuditFields } from '@/composables/operations/useAuditFields';
import { formatDate } from '@/helpers/formatDate';
import { useOperationsStore } from '@/stores/useOperationsStore';
import type { InputValidationFromScript } from '@/views/operations/OperationEditPage.vue';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

const props = defineProps({
    formModel: { type: Object, required: true },
    submitLabel: { type: String, default: 'Submit' },
    submitIcon: { type: String, default: 'pi pi-check' },
    loading: { type: Boolean, default: false },
    showAudit: { type: Boolean, default: true },
    showOperationLinks: { type: Boolean, default: false },
    invalidInputs: { type: Array<InputValidationFromScript>, default: () => [] }
});

const emit = defineEmits<{
    (event: 'submit', payload: { valid: boolean; values: typeof props.formModel }): void;
    (event: 'valueUpdated', payload: { field: any }): void;
}>();
const [backLabel, backIcon] = [t('default.back'), 'pi pi-arrow-left'];
const { definition } = useActiveDefinition();
const { metaFields } = useOperationMetaFields(definition);
const { formRef, onSubmit, exposeFns } = useFormController(emit, props.formModel);
const { operationResolver } = useResolvers();
const { contentFields } = useOperationContentFields(definition);
const accountsStore = useAccountsStore();
const currencyStore = useCurrencyStore();
const { auditFields } = useAuditFields();

const linksTabsRef = ref();
defineExpose({
    ...exposeFns,
    getOperationLinks: () => linksTabsRef.value?.getOperationLinks?.()
});

onMounted(async () => {
    try {
        await accountsStore.fetchAllAccounts();
        await currencyStore.fetchAllCurrencies();

        await setOptions(contentFields.value);
    } catch (err) {
        console.error('Failed to load accounts:', err);
    }
});

const accountOptions = computed(() =>
    Array.from(accountsStore.accounts.values()).map((acc) => ({
        label: acc.name,
        value: acc.id
    }))
);

const currencyOptions = computed(() =>
    currencyStore.currencies.map((acc) => ({
        label: `${acc.code} - ${acc.name.toUpperCase()}`,
        value: acc.id
    }))
);

const mapEnumOptions = (field: any) => {
    return (field.enumValues || []).map((ev: any) => ({
        label: ev.name,
        value: ev.value
    }));
};

const groupedContentFields = computed(() => {
    const fields = contentFields.value.filter((f) => f.component !== 'Checkbox');
    const groups = new Map<string, any[]>();

    fields.forEach((field) => {
        const fieldName = field.label;
        let groupKey: string;

        if (fieldName.includes('$')) {
            groupKey = fieldName.split('$')[0];
        } else {
            groupKey = fieldName;
        }

        if (!groups.has(groupKey)) {
            groups.set(groupKey, []);
        }
        let adjustedLabel = fieldName;
        if (fieldName.includes('$')) {
            adjustedLabel = fieldName.replace(`${groupKey}$`, '');
        } else {
            adjustedLabel = fieldName;
        }
        groups.get(groupKey)!.push({ ...field, label: adjustedLabel });
    });

    return Array.from(groups.entries()).map(([key, fields]) => ({
        key,
        fields
    }));
});

const mapaOptions = ref<Map<string, Array<any>>>(new Map());
const operationsStore = useOperationsStore();

async function setOptions(contentFields: any) {
    for (const field of contentFields.filter(
        (field: {
            operationDefinitionFilter: { parameters: { [key in string]: { value?: string } } };
        }) =>
            field.operationDefinitionFilter &&
            field.operationDefinitionFilter.parameters['operationDefinition']?.value
    )) {
        const response = (
            await operationsStore.fetchAllOperations(
                0,
                50000,
                //@ts-ignore
                undefined,
                undefined,
                field.operationDefinitionFilter.parameters['operationDefinition']?.value
            )
        ).content.map((operation) => ({
            label: operation.name,
            value: operation.id
        }));

        mapaOptions.value.set(field.name, response);
    }

    contentFields.forEach((field: { special: string; name: string }) => {
        switch (field.special) {
            case 'account':
                return mapaOptions.value.set(field.name, accountOptions.value);
            case 'currency':
                return mapaOptions.value.set(field.name, currencyOptions.value);
            case 'enumFields':
                return mapaOptions.value.set(field.name, mapEnumOptions(field));
            default:
                return [];
        }
    });
}

const getOptions = (field: any) => {
    return mapaOptions.value.get(field.name) ?? [];
};

const internalInvalidInputs = ref<Array<InputValidationFromScript>>([]);

watch(
    () => props.invalidInputs,
    (newValue) => {
        if (newValue?.length) {
            internalInvalidInputs.value = newValue;

            nextTick(() => {
                formRef.value?.validate?.();
            });
        }
    },
    {
        deep: true
    }
);

const handleBack = ($evt) => {
    $evt.preventDefault();
    router.go(-1);
};

async function handleUpdateInput($form: any, field: any, newValue: any) {
    const currentValue = newValue;
    const previousValue = props.formModel[field.name];

    // Porovnání hodnot - kontrola skutečné změny
    if (currentValue === previousValue) {
        console.log(`No change for ${field.name}, skipping`);
        return;
    }

    console.log(`Value changed for ${field.name}:`, previousValue, '->', currentValue);

    //TODO no to je presne o cem se hadame uz 4 roky...
    props.formModel[field.name] = newValue;

    deleteFromInvalid(field.name);
    setValidity($form, field.name);

    console.log('zmena', $form, field.name);

    emit('valueUpdated', { field: field });
}

function deleteFromInvalid(fieldName: string) {
    const index = internalInvalidInputs.value.findIndex((x) => x.field === fieldName);
    if (index > -1) {
        internalInvalidInputs.value.splice(index, 1);
    }
}

function setValidity($form: any, fieldName: string) {
    if ($form[fieldName]) $form[fieldName].invalid = false;
}
</script>
