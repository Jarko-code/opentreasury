/*
import { computed } from 'vue';
import type { StaticColumns } from '@/types/operations/columns';
import { useI18n } from 'vue-i18n';

export const useScriptColumns = () => {
    const { t } = useI18n();

    // Static columns using i18n
    const staticScriptColumns = computed<StaticColumns[]>(() => [
        { name: 'displayName', displayName: t('scripts.columns.displayName') },
        { name: 'description', displayName: t('scripts.columns.description') },
        { name: 'type', displayName: t('scripts.columns.type') }
    ]);

    return { staticScriptColumns };
};
*/
