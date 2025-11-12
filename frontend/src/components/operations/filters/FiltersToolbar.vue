<template>
    <div class="flex gap-2">
        <!-- Input na názov + uložiť -->
        <div class="flex gap-2">
            <InputText
                :modelValue="newFilterName"
                @update:modelValue="onUpdateNewFilterName"
                :placeholder="t('default.filterName')"
                class="flex-1"
            />
            <Button
                icon="pi pi-save"
                v-tooltip.bottom="t('default.saveFilter')"
                @click="onSaveFilter"
            />
        </div>

        <!-- Výber / uloženie filtra -->
        <div v-if="!selectedFilter" class="flex flex-col gap-2">
            <Select
                :modelValue="selectedFilter"
                @update:modelValue="onUpdateSelectedFilter"
                :options="props.savedFilters"
                optionLabel="name"
                optionValue="id"
                :placeholder="t('default.filterSelect')"
                class="w-full"
            />
        </div>

        <!-- Aktívny filter + akcie -->
        <div v-else class="flex items-center justify-between text-sm">
            <span>
                {{ t('default.activeFilter') }}
                <strong>
                    {{ props.savedFilters.find((f) => f.id === selectedFilter)?.name }}
                </strong>
            </span>
            <div class="flex items-center gap-1 ml-2">
                <Button
                    icon="pi pi-download"
                    severity="info"
                    text
                    size="small"
                    v-tooltip.bottom="t('default.loadFilter')"
                    @click="onLoadFilter"
                />
                <Button
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    size="small"
                    v-tooltip.bottom="t('default.deleteFilter')"
                    @click="onDeleteFilter"
                />
                <Button
                    v-if="selectedFilter"
                    icon="pi pi-times"
                    severity="secondary"
                    text
                    v-tooltip.bottom="t('default.reset')"
                    @click="onResetFilter"
                />
            </div>
        </div>

        <Button
            v-if="showClearAll"
            :label="t('default.clearAllFilters')"
            class="ml-2"
            severity="warn"
            @click="onClearAll"
        />
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
    savedFilters: any[];
    selectedFilter: string | null;
    newFilterName: string;
    showClearAll: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:newFilterName', value: string): void;
    (e: 'update:selectedFilter', value: string | null): void;
    (e: 'delete-filter', id: string | null): void;
    (e: 'load-filter', id: string | null): void;
    (e: 'clear-all-filters'): void;
    (e: 'save-filter'): void;
}>();

// wrappery pre emits
const onUpdateNewFilterName = (val: string | undefined) => emit('update:newFilterName', val ?? '');
const onUpdateSelectedFilter = (val: string | null) => emit('update:selectedFilter', val);
const onSaveFilter = () => emit('save-filter');
const onLoadFilter = () => emit('load-filter', props.selectedFilter);
const onDeleteFilter = () => emit('delete-filter', props.selectedFilter);
const onResetFilter = () => emit('update:selectedFilter', null);
const onClearAll = () => emit('clear-all-filters');
</script>
