import { computed, toRaw } from 'vue';
import { useOperationColumns } from '@/composables/operations/columnFields';
import { useI18n } from 'vue-i18n';

export const useOperationContentFields = (definition: any) => {
    const { t } = useI18n();
    const {
        dateFields,
        numberFields,
        booleanFields,
        referenceFields,
        operationCurrencyFields,
        enumFields,
        dynaProps
    } = useOperationColumns(definition);

    const contentFields = computed(() => {
        const rawProps = toRaw(dynaProps.value) ?? [];

        return rawProps.map((prop: any) => {
            let component = '';
            let special: string | null = null;

            if (dateFields.value.includes(prop.name)) {
                component = 'Calendar';
            } else if (numberFields.value.includes(prop.name)) {
                component = 'NumberInput';
            } else if (booleanFields.value.includes(prop.name)) {
                component = 'Checkbox';
            } else if (
                referenceFields.value.includes(prop.name) ||
                operationCurrencyFields.value.includes(prop.name)
            ) {
                component = 'Select';
                special = prop.details?.entityType?.toLowerCase(); // napr. account / operation / currency
            } else if (enumFields.value.includes(prop.name)) {
                component = 'Select';
                special = 'enumFields';
            } else {
                component = 'InputText';
            }

            return {
                name: prop.name,
                label: prop.displayName || prop.name,
                component,
                special,
                disabled: false,
                enumValues: prop.details?.enumValues ?? [],
                operationDefinitionFilter: prop.details?.entityFilter,
                recalculationScripts: prop.recalculationScripts
            };
        });
    });

    return { contentFields };
};
