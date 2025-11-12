<script setup lang="ts" generic="T">
import { ref, watch } from 'vue';
import { Button, Popover, Tabs, TabList, TabPanel } from 'primevue';
import type { TableColumn } from '@/types/generic-data-table/definition-types';
import { useTableColumnManager } from '@/composables/data-table/useTableColumnManager';

const props = defineProps<{
    columns: Array<TableColumn<T>>;
    storageKey?: string; //ukladani jeste nemam...
}>();

const emit = defineEmits<{
    (e: 'update-columns', visibleColumns: Array<TableColumn<T>>): void;
}>();

const popoverRef = ref();

const {
    visibleColumns,
    orderedColumns,
    columnStates,
    allColumnsVisible,
    toggleColumn,
    toggleAllColumns,
    reorderColumns,
    resetColumns
} = useTableColumnManager<T>({
    columns: props.columns,
    storageKey: props.storageKey
});

watch(
    visibleColumns,
    (cols) => {
        emit('update-columns', cols);
    },
    { immediate: true }
);

function togglePopover(event: Event): void {
    popoverRef.value?.toggle(event);
}
</script>

<template>
    <div>
        <Button icon="pi pi-cog" @click="togglePopover" outlined severity="secondary" />
        <Popover ref="popoverRef">
            <div class="w-[400px]">
                <Tabs value="0">
                    <TabList>
                        <Tab value="0">Sloupce</Tab>
                    </TabList>
                    <TabPanel value="0">
                        <table-column-manager
                            :columns="orderedColumns"
                            :column-states="columnStates"
                            :all-columns-visible="allColumnsVisible"
                            @toggle-column="toggleColumn"
                            @toggle-all="toggleAllColumns"
                            @reorder="reorderColumns"
                            @reset="resetColumns"
                        />
                    </TabPanel>
                </Tabs>
            </div>
        </Popover>
    </div>
</template>
