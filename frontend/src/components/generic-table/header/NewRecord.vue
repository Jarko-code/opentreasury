<script setup lang="ts">
import type { RouteValue } from '@/router/names';
import { useI18n } from 'vue-i18n';

const { route } = defineProps<{
    route?: RouteValue;
}>();

const { t } = useI18n();
</script>

<template>
    <Router-Link :to="{ name: route }">
        <Button icon="pi pi-plus" severity="primary" v-tooltip.bottom="t('operations.create')" />
    </Router-Link>
</template>
