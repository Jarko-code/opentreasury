<template>
    <Button :label="label" :icon="icon" :severity="severity" @click="handleClick" />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

const props = defineProps({
    label: {
        type: String,
        default: 'Back '
    },
    icon: {
        type: String,
        default: 'pi pi-chevron-left'
    },
    severity: {
        type: String,
        default: 'secondary'
    },
    to: {
        type: [String, Object],
        required: false,
        default: null
    }
});

const handleClick = () => {
    if (props.to) {
        router.push(props.to);
    } else {
        router.go(-1);
    }
};
</script>
