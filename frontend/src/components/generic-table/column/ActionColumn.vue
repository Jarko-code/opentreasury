<script setup lang="ts" generic="T">
import type { TableAction } from '@/types/generic-data-table/definition-types';
import { Button } from 'primevue';

defineProps<{
    record: T;
    actions?: Array<TableAction<T>>;
}>();

function handleAction(action: TableAction<T>, record: T): void {
    action.onClick(record);
}
</script>

<template>
    <div class="flex gap-2">
        <Button
            v-for="action in actions"
            :key="action.name"
            :icon="action.icon"
            :label="action.label"
            :severity="action.severity"
            size="small"
            @click="handleAction(action, record)"
        />
    </div>
</template>
