/*
import { useI18n } from 'vue-i18n';
import { formatDate } from '@/helpers/formatDate';
import type { StaticColumns } from '@/types/operations/columns';
import { computed } from 'vue';

export const useProcessesColumns = () => {
    const { t } = useI18n();

    const staticProcessesColumns = computed<StaticColumns[]>(() => [
        {
            name: 'id',
            displayName: t('processes.columns.id') || 'ID'
        },
        {
            name: 'progress',
            displayName: t('processes.columns.progress') || 'Progress'
        },
        {
            name: 'startedBy',
            displayName: t('processes.columns.startedBy') || 'Started By'
        },
        {
            name: 'lastMessage',
            displayName: t('processes.columns.lastMessage') || 'Last Message'
        },
        {
            name: 'startTime',
            displayName: t('processes.columns.startTime') || 'Start Time',
            format: (value: string) => formatDate(value)
        },
        {
            name: 'finishTime',
            displayName: t('processes.columns.finishTime') || 'Finish Time',
            format: (value: string) => formatDate(value)
        }
    ]);

    return { staticProcessesColumns };
};
*/
