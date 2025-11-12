<template>
    <div>
        <!-- tlačidlo na otvorenie -->
        <Button
            icon="pi pi-cog"
            class="p-button-text mr-2"
            @click="toggleOverlay"
            v-tooltip.bottom="t('default.settings')"
        />

        <!-- overlay panel -->
        <OverlayPanel ref="overlayRef">
            <div class="p-3 min-w-[500px]">
                <Tabs value="columns">
                    <TabList>
                        <Tab value="columns">{{ t('default.columns') }}</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel value="columns">
                            <div class="flex items-center justify-between border-b pb-2 mb-3">
                                <h3 class="text-sm font-semibold">
                                    {{ t('default.columnToggle') }}
                                </h3>
                                <div class="flex items-center gap-2">
                                    <label class="text-xs">{{ t('default.all') }}</label>
                                    <ToggleSwitch
                                        v-model="masterToggle"
                                        :true-value="true"
                                        :false-value="false"
                                    />
                                </div>
                            </div>

                            <div class="grid grid-cols-3 gap-4">
                                <div
                                    v-for="col in allColumns"
                                    :key="col.name"
                                    class="flex items-center justify-between"
                                >
                                    <label class="text-xs truncate">{{ col.displayName }}</label>
                                    <ToggleSwitch
                                        v-model="columnToggles[col.name]"
                                        :true-value="true"
                                        :false-value="false"
                                        class="ml-2"
                                    />
                                </div>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </OverlayPanel>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ColumnDef } from '@/types/operations/columns';

const props = defineProps<{
    allColumns: ColumnDef[];
    definitionId: string | undefined;
}>();

const emits = defineEmits<{
    (e: 'update:visibleColumns', value: ColumnDef[]): void;
}>();

const { t } = useI18n();
const overlayRef = ref();

// state
const masterToggle = ref(true);
const columnToggles = ref<Record<string, boolean>>({});

// storage key – dynamicky podľa definitionId
const STORAGE_KEY = computed(() => `operations_settings_${props.definitionId ?? 'default'}`);

// načítanie uložených nastavení
const loadSettings = () => {
    const saved = localStorage.getItem(STORAGE_KEY.value);
    if (saved) {
        const parsed = JSON.parse(saved);
        columnToggles.value = parsed.columns || {};
    } else {
        enableAllColumns();
    }
};

// zapnutie všetkých
const enableAllColumns = () => {
    columnToggles.value = Object.fromEntries(props.allColumns.map((c) => [c.name, true]));
};

// ukladanie do localStorage
const saveSettings = () => {
    localStorage.setItem(
        STORAGE_KEY.value,
        JSON.stringify({
            columns: columnToggles.value
        })
    );
};

// toggle overlay
const toggleOverlay = (event: Event) => {
    overlayRef.value?.toggle(event);
};

// vypočítané viditeľné stĺpce
const visibleColumns = computed(() =>
    props.allColumns.filter((col) => columnToggles.value[col.name])
);

// watchers
watch(
    columnToggles,
    () => {
        const values = Object.values(columnToggles.value);
        masterToggle.value = values.every((v) => v)
            ? true
            : values.every((v) => !v)
              ? false
              : masterToggle.value;

        saveSettings();
        emits('update:visibleColumns', visibleColumns.value);
    },
    { deep: true }
);

watch(masterToggle, (val) => {
    columnToggles.value = Object.fromEntries(props.allColumns.map((c) => [c.name, val]));
});

// 🔥 kľúčová oprava – keď sa zmení definitionId, načítaj nové nastavenia
watch(
    () => props.definitionId,
    () => {
        loadSettings();
        emits('update:visibleColumns', visibleColumns.value);
    }
);

// lifecycle
onMounted(() => {
    loadSettings();
    emits('update:visibleColumns', visibleColumns.value);
});
</script>
