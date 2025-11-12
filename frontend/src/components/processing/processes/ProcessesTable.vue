<template>
    <GenericTable
        :subpageTitle="t('processes.title')"
        :store="processesStore"
        store-items-key="processes"
        fetch-method="fetchAllProcesses"
        :staticColumns="staticProcessesColumns"
        :pageBase="1"
    ></GenericTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useProcessesStore } from '@/stores/useProcessesStore';
import { useProcessesColumns } from '@/components/processing/processes/processes.table.config';

const { t } = useI18n();
const processesStore = useProcessesStore();
const { staticProcessesColumns } = useProcessesColumns();
</script>
