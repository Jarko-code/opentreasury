<template>
    <div class="flex flex-col gap-2 w-full">
        <!-- Relatívny / ISO input -->
        <div v-if="!dateValue" class="flex items-center gap-2">
            <InputText
                v-model="textValue"
                :placeholder="t('default.relativeDate')"
                class="w-full"
            />
            <i
                class="pi pi-question-circle cursor-pointer"
                v-tooltip="t('default.relativeDateHint')"
            />
        </div>

        <!-- Absolútny dátum -->
        <DatePicker
            v-if="!textValue"
            v-model="dateValue"
            class="w-full"
            dateFormat="dd.mm.yy"
            showIcon
        />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
    modelValue: any;
    operator: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void;
}>();

const { t } = useI18n();

const textValue = ref<string>(''); // relatívny výraz / ISO / manuálne
const dateValue = ref<Date | null>(null); // absolútny dátum

// sync: text → emit + reset date
watch(textValue, (val) => {
    if (val && val.trim() !== '') {
        dateValue.value = null;
        emit('update:modelValue', val.trim());
    } else if (dateValue.value) {
        emit('update:modelValue', dateValue.value);
    } else {
        emit('update:modelValue', null);
    }
});

// sync: dátum → emit + reset text
watch(dateValue, (val) => {
    if (val) {
        textValue.value = '';
        emit('update:modelValue', val);
    }
});

// 🔑 Prefill pri načítaní / zmene filtra
watch(
    () => props.modelValue,
    (val) => {
        if (!val) {
            textValue.value = '';
            dateValue.value = null;
            return;
        }

        if (val instanceof Date) {
            dateValue.value = val;
            textValue.value = '';
        } else if (typeof val === 'string') {
            textValue.value = val;
            dateValue.value = null;
        }
    },
    { immediate: true } // 👈 spustí sa aj hneď pri mountnutí
);
</script>
