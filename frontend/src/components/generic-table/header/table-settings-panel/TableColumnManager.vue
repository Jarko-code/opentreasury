<script setup lang="ts" generic="T">
import { ref } from 'vue';
import { Button, ToggleSwitch } from 'primevue';
import type {
    TableColumn,
    TableColumnManagerEmits
} from '@/types/generic-data-table/definition-types';

const props = defineProps<{
    columns: Array<TableColumn<T>>;
    columnStates: Record<string, boolean>;
    allColumnsVisible: boolean;
}>();

const emit = defineEmits<TableColumnManagerEmits<T>>();

const draggedIndex = ref<number | null>(null);
const draggedOverIndex = ref<number | null>(null);

function handleToggle(columnName: string, value: boolean): void {
    emit('toggle-column', columnName, value);
}

function handleToggleAll(value: boolean): void {
    emit('toggle-all', value);
}

function handleDragStart(event: DragEvent, index: number): void {
    draggedIndex.value = index;
    event.dataTransfer!.effectAllowed = 'move';
}

function handleDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    draggedOverIndex.value = index;
}

function handleDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    if (draggedIndex.value === null || draggedIndex.value === dropIndex) return;
    const newOrder = [...props.columns];
    const [draggedItem] = newOrder.splice(draggedIndex.value, 1);
    newOrder.splice(dropIndex, 0, draggedItem);
    emit('reorder', newOrder);
    draggedIndex.value = draggedOverIndex.value = null;
}
</script>

<template>
    <div class="space-y-3">
        <div class="flex justify-between items-center">
            <span class="text-sm text-muted-color">Správa zobrazení sloupců</span>
            <Button label="Reset" size="small" icon="pi pi-refresh" text @click="$emit('reset')" />
        </div>

        <div
            class="flex items-center justify-between p-2 rounded-md bg-surface-100 dark:bg-surface-800"
        >
            <label class="font-medium cursor-pointer">Všechny sloupce</label>
            <ToggleSwitch :modelValue="allColumnsVisible" @update:modelValue="handleToggleAll" />
        </div>

        <div class="space-y-1 max-h-96 overflow-y-auto">
            <div
                v-for="(col, index) in columns"
                :key="col.name"
                class="flex items-center justify-between p-2 rounded-md cursor-move hover:bg-surface-100 dark:hover:bg-surface-700"
                draggable="true"
                @dragstart="handleDragStart($event, index)"
                @dragover="handleDragOver($event, index)"
                @drop="handleDrop($event, index)"
            >
                <div class="flex items-center gap-2 min-w-0 flex-1">
                    <i class="pi pi-bars text-muted-color text-xs shrink-0" />
                    <span class="truncate flex-1 cursor-pointer select-none" :title="col.label">
                        {{ col.label }}
                    </span>
                </div>
                <ToggleSwitch
                    :modelValue="columnStates[col.name]"
                    @update:modelValue="(v) => handleToggle(col.name, v)"
                    @click.stop
                />
            </div>
        </div>

        <p class="text-xs text-center text-muted-color border-t pt-2">
            Přetáhněte sloupce pro změnu pořadí
        </p>
    </div>
</template>
