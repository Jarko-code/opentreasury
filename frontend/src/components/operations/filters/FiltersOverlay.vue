<template>
    <OverlayPanel ref="overlayRef">
        <div class="flex flex-col gap-3 p-2 w-64">
            <h4 v-if="props.activeColumn" class="font-semibold">
                {{ props.activeColumn.displayName }}
            </h4>

            <!-- number -->
            <template
                v-if="
                    props.activeColumn && props.getColumnType(props.activeColumn!.name) === 'number'
                "
            >
                <Select
                    :modelValue="props.filters[props.activeColumn!.name].operator"
                    @update:modelValue="
                        (val) => (props.filters[props.activeColumn!.name].operator = val)
                    "
                    :options="props.operators.number"
                    optionLabel="label"
                    optionValue="value"
                    :placeholder="t('default.operator')"
                />

                <InputNumber
                    v-if="
                        ['equals', 'notEquals', 'gt', 'lt', 'gte', 'lte'].includes(
                            props.filters[props.activeColumn!.name].operator
                        )
                    "
                    :modelValue="props.filters[props.activeColumn!.name].value"
                    @update:modelValue="
                        (val) => (props.filters[props.activeColumn!.name].value = val)
                    "
                    class="w-full"
                    :placeholder="t('default.value')"
                />

                <div
                    v-else-if="props.filters[props.activeColumn!.name].operator === 'between'"
                    class="flex flex-col gap-2"
                >
                    <InputNumber
                        :modelValue="props.filters[props.activeColumn!.name].value.from"
                        @update:modelValue="
                            (val) => (props.filters[props.activeColumn!.name].value.from = val)
                        "
                        class="w-full"
                        :placeholder="t('default.from')"
                    />
                    <InputNumber
                        :modelValue="props.filters[props.activeColumn!.name].value.to"
                        @update:modelValue="
                            (val) => (props.filters[props.activeColumn!.name].value.to = val)
                        "
                        class="w-full"
                        :placeholder="t('default.to')"
                    />
                </div>
            </template>

            <!-- string -->
            <template
                v-else-if="
                    props.activeColumn && props.getColumnType(props.activeColumn!.name) === 'string'
                "
            >
                <Select
                    :modelValue="props.filters[props.activeColumn!.name].operator"
                    @update:modelValue="
                        (val) => (props.filters[props.activeColumn!.name].operator = val)
                    "
                    :options="props.operators.string"
                    optionLabel="label"
                    optionValue="value"
                    :placeholder="t('default.operator')"
                />

                <InputText
                    v-if="props.filters[props.activeColumn!.name].operator"
                    :modelValue="props.localValue"
                    @update:modelValue="(val) => emit('update:localValue', val ?? '')"
                    class="w-full"
                    :placeholder="t('default.value')"
                />
            </template>

            <!-- date -->
            <template
                v-else-if="
                    props.activeColumn && props.getColumnType(props.activeColumn!.name) === 'date'
                "
            >
                <Select
                    :modelValue="props.filters[props.activeColumn!.name].operator"
                    @update:modelValue="
                        (val) => (props.filters[props.activeColumn!.name].operator = val)
                    "
                    :options="props.operators.date"
                    optionLabel="label"
                    optionValue="value"
                    :placeholder="t('default.operator')"
                />

                <!-- rovnosť (=) → nový komponent -->
                <FilterDateInput
                    v-if="['dateBefore', 'dateAfter', 'dateIs'].includes(
                            props.filters[props.activeColumn!.name].operator
                        )"
                    v-model="props.filters[props.activeColumn!.name].value"
                    :operator="props.filters[props.activeColumn!.name].operator"
                />

<!--                &lt;!&ndash; pred, po → klasický DatePicker &ndash;&gt;-->
<!--                <DatePicker-->
<!--                    v-else-if="-->
<!--                        ['dateBefore', 'dateAfter', 'dateIs'].includes(-->
<!--                            props.filters[props.activeColumn!.name].operator-->
<!--                        )-->
<!--                    "-->
<!--                    :modelValue="props.filters[props.activeColumn!.name].value"-->
<!--                    @update:modelValue="-->
<!--                        (val) => (props.filters[props.activeColumn!.name].value = val)-->
<!--                    "-->
<!--                    class="w-full"-->
<!--                    dateFormat="dd.mm.yy"-->
<!--                    showIcon-->
<!--                />-->

                <!-- between → dvojica DatePickerov -->
                <div
                    v-else-if="props.filters[props.activeColumn!.name].operator === 'between'"
                    class="flex flex-col gap-2"
                >
                    <DatePicker
                        :modelValue="props.filters[props.activeColumn!.name].value.from"
                        @update:modelValue="
                            (val) => (props.filters[props.activeColumn!.name].value.from = val)
                        "
                        class="w-full"
                        dateFormat="dd.mm.yy"
                        :placeholder="t('default.from')"
                        showIcon
                    />
                    <DatePicker
                        :modelValue="props.filters[props.activeColumn!.name].value.to"
                        @update:modelValue="
                            (val) => (props.filters[props.activeColumn!.name].value.to = val)
                        "
                        class="w-full"
                        dateFormat="dd.mm.yy"
                        :placeholder="t('default.to')"
                        showIcon
                    />
                </div>
            </template>

            <!-- boolean -->
            <template
                v-else-if="
                    props.activeColumn &&
                    props.getColumnType(props.activeColumn!.name) === 'boolean'
                "
            >
                <Select
                    :modelValue="props.filters[props.activeColumn!.name].value"
                    @update:modelValue="
                        (val) => (props.filters[props.activeColumn!.name].value = val)
                    "
                    :options="props.operators.boolean"
                    optionLabel="label"
                    optionValue="value"
                    :placeholder="t('default.value')"
                />
            </template>

            <!-- reference -->
            <template
                v-else-if="
                    props.activeColumn &&
                    props.getColumnType(props.activeColumn!.name) === 'reference'
                "
            >
                <Select
                    :modelValue="props.filters[props.activeColumn!.name].operator"
                    @update:modelValue="
                        (val) => (props.filters[props.activeColumn!.name].operator = val)
                    "
                    :options="props.operators.reference"
                    optionLabel="label"
                    optionValue="value"
                    :placeholder="t('default.operator')"
                    class="w-full"
                />

                <!-- equals -->
                <Select
                    v-if="props.filters[props.activeColumn!.name].operator === 'equals'"
                    :modelValue="props.filters[props.activeColumn!.name].value"
                    @update:modelValue="
                        (val) => (props.filters[props.activeColumn!.name].value = val)
                    "
                    :options="props.referenceOptions[props.activeColumn!.name] || []"
                    optionLabel="label"
                    optionValue="value"
                    :placeholder="t('default.select')"
                    class="w-full"
                />

                <!-- in -->
                <MultiSelect
                    v-else-if="props.filters[props.activeColumn!.name].operator === 'in'"
                    :modelValue="props.filters[props.activeColumn!.name].value"
                    @update:modelValue="
                        (val) => (props.filters[props.activeColumn!.name].value = val)
                    "
                    :options="props.referenceOptions[props.activeColumn!.name] || []"
                    optionLabel="label"
                    optionValue="value"
                    :placeholder="t('default.selectMultiple')"
                    class="w-full"
                    display="chip"
                />
            </template>

            <!-- footer buttons -->
            <div class="flex justify-end gap-2 pt-2">
                <Button
                    v-if="props.activeColumn"
                    :label="t('default.clear')"
                    class="p-button-text p-button-sm"
                    @click="emit('clear-filter', props.activeColumn!.name)"
                />
                <Button
                    :label="t('default.apply')"
                    class="p-button-sm"
                    @click="emit('apply-filter')"
                />
            </div>
        </div>
    </OverlayPanel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

type ColumnDef = { name: string; displayName: string };

const { t } = useI18n();

const props = defineProps<{
    filters: Record<string, any>;
    activeColumn: ColumnDef | null;
    localValue: string;
    operators: Record<string, any[]>;
    referenceOptions: Record<string, { label: string; value: string }[]>;
    getColumnType: (col: string) => string;
}>();

const emit = defineEmits<{
    (e: 'apply-filter'): void;
    (e: 'clear-filter', colName: string): void;
    (e: 'update:localValue', value: string): void;
}>();

const overlayRef = ref<any>(null);
const toggle = (e?: any) => overlayRef.value?.toggle(e);
const show = (e?: any) => overlayRef.value?.show(e);
const hide = () => overlayRef.value?.hide();

defineExpose({ toggle, show, hide });
</script>
