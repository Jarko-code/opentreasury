import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useOperationColumns } from '@/composables/operations/columnFields';

export const useOperationMetaFields = (definition: any) => {
    const { t } = useI18n();
    const { staticColumns } = useOperationColumns(definition);

    const fieldOrder = ['id', 'name', 'source', 'actualStatus'];

    const metaFields = computed(() => {
        const base = fieldOrder
            .map((name) => staticColumns.value.find((col) => col.name === name))
            .filter((col): col is NonNullable<typeof col> => Boolean(col));

        return base.map((col) => {
            let component = 'InputText';
            let options: { label: string; value: string }[] | null = null;
            let disabled = false;

            if (col.name === 'id') {
                disabled = true;
            }

            if (col.name === 'actualStatus') {
                component = 'Select';
                options = [
                    { label: t('operations.form.status.na'), value: 'n/a' },
                    { label: t('operations.form.status.draft'), value: 'DRAFT' },
                    { label: t('operations.form.status.live'), value: 'LIVE' }
                ];
            }

            return {
                name: col.name,
                label: col.displayName || col.name,
                component,
                options,
                disabled
            };
        });
    });

    return { metaFields };
};
