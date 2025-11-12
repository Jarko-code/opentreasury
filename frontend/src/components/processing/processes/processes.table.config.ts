import { useI18n } from 'vue-i18n';
import { formatDate } from '@/helpers/formatDate';
import type { StaticColumns } from '@/types/operations/columns';
import { computed } from 'vue';
import { shortId } from '@/helpers/shortId';
import { findUserNameById } from '@/composables/useNameById';

export const useProcessesColumns = () => {
    const { t } = useI18n();

    const staticProcessesColumns = computed((): StaticColumns[] => [
        {
            name: 'id',
            displayName: t('processes.columns.id') || 'ID',
            format: (value: unknown) => shortId(String(value)) || ''
        },
        {
            name: 'progress',
            displayName: t('processes.columns.progress') || 'Progress',
            format: (value: unknown) => `${(Number(value) * 100).toFixed(0)}%`
        },
        {
            name: 'startedBy',
            displayName: t('processes.columns.startedBy') || 'Started By',
            format: (value: unknown) => findUserNameById(String(value)) || ''
        },
        {
            name: 'lastMessage',
            displayName: t('processes.columns.lastMessage') || 'Last Message'
        },
        {
            name: 'startTime',
            displayName: t('processes.columns.startTime') || 'Start Time',
            format: (value: unknown) => formatDate(String(value)) || ''
        },
        {
            name: 'finishTime',
            displayName: t('processes.columns.finishTime') || 'Finish Time',
            format: (value: unknown) => formatDate(String(value)) || ''
        }
    ]);

    return { staticProcessesColumns };
};
