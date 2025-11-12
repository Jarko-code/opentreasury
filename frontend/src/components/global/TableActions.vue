<!-- TableActions.vue -->
<template>
    <div v-if="hasAnyAction" class="flex items-center justify-center">
        <!-- Copy -->
        <Button
            v-if="showCopy"
            icon="pi pi-copy"
            size="small"
            class="p-button-text !p-0"
            v-tooltip.bottom="props.copyTooltip"
            @click="emit('copy', id)"
        />

        <!-- Edit -->
        <Button
            v-if="showEdit"
            icon="pi pi-pencil"
            size="small"
            severity="info"
            class="p-button-text !p-0"
            v-tooltip.bottom="props.editTooltip"
            @click="emit('edit', id)"
        />

        <!-- Run Operation -->
        <Button
            v-if="showOperation"
            icon="pi pi-file-plus"
            size="small"
            severity="warn"
            class="p-button-text !p-0"
            v-tooltip.bottom="props.operationTooltip"
            @click="emit('operation', id)"
        />

        <!-- Delete -->
        <Button
            v-if="showDelete"
            icon="pi pi-trash"
            size="small"
            severity="danger"
            class="p-button-text !p-0"
            v-tooltip.bottom="props.deleteTooltip"
            @click="emit('delete', id)"
        />

        <!-- priestor na budúce/extra akcie -->
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TableActions, Id } from '../../types/TableActions';

const props = withDefaults(defineProps<TableActions>(), {
    showCopy: false,
    showDelete: false,
    showOperation: false,
    showEdit: false,
    copyTooltip: 'Copy',
    editTooltip: 'Edit',
    deleteTooltip: 'Delete',
    operationTooltip: 'Operation'
});

const emit = defineEmits<{
    (e: 'copy', id: Id): void;
    (e: 'delete', id: Id): void;
    (e: 'operation', id: Id): void;
    (e: 'edit', id: Id): void;
}>();

const hasAnyAction = computed(
    () => props.showCopy || props.showDelete || props.showOperation || props.showEdit
);
</script>
