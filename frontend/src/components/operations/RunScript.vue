<template>
    <div class="flex items-center gap-1">
        <Button
            v-for="script in relevantScripts"
            :key="script.id"
            v-tooltip.bottom="script.description"
            @click="() => handleRunScript(script)"
        >
            <font-awesome-icon :icon="['fas', script.icon]" />
            {{ script.name }}
        </Button>

        <div
            v-if="isLoading"
            class="fixed inset-0 z-9999 flex items-center justify-center"
            :style="{ backgroundColor: 'var(--overlay-bg)' }"
        >
            <div
                class="rounded-2xl shadow-xl px-12 py-4 text-lg flex flex-col items-center gap-3"
                :style="{
                    backgroundColor: 'var(--main-bg)',
                    color: 'var(--login-form-color)',
                    boxShadow: 'var(--header-shadow)'
                }"
            >
                <font-awesome-icon icon="spinner" spin size="2x" />
                <span>{{ $t('default.wait') }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useScriptsStore } from '@/stores/useScriptsStore';
import { useConfirmOperation } from '@/composables/useConfirmOperation';
import type { ScriptResult } from '@/types/script-results.ts';

const props = defineProps<{
    definitionId?: string;
    operation?: Record<string, any>;
}>();

const emits = defineEmits<{
    (e: 'finished', value: ScriptResult): void;
}>();
const scriptStore = useScriptsStore();
const { scripts, isLoading } = storeToRefs(scriptStore);
const { confirmOperation } = useConfirmOperation();

const relevantScripts = computed(() => {
    if (!scripts.value?.length) return [];
    return scripts.value.filter(
        (s) =>
            s.type === 'EVENT_TRIGGER' &&
            s.triggerObjectType === 'operation' &&
            s.triggerActionTypes?.includes('REQUESTED') &&
            (!props.definitionId || s.operationDefinitions?.includes(props.definitionId))
    );
});

const handleRunScript = async (script: any) => {
    if (!props.operation) return;

    const cleanedOperation = Object.fromEntries(
        Object.entries(props.operation).filter(([key]) => !key.endsWith('_name'))
    );

    const values = {
        action: 'REQUESTED',
        payload: { content: { ...cleanedOperation } }
    };

    confirmOperation(async () => {
        try {
            const result = (await scriptStore.runSync(script.id, values)) as ScriptResult;
            emits('finished', result);
        } catch (err) {
            console.error('Script run failed:', err);
        }
    });
};
</script>
