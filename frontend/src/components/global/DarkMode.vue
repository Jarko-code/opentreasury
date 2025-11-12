<template>
    <div class="card flex justify-center">
        <ToggleSwitch v-model="checked" @click="toggleDarkMode">
            <template #handle="{ checked }">
                <i :class="['!text-xs pi', { 'pi-sun': checked, 'pi-moon': !checked }]" />
            </template>
        </ToggleSwitch>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const prefersDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;

const darkModePref: string | null = localStorage.getItem('dark-mode');
const checked = ref<boolean>(darkModePref !== null ? darkModePref === 'true' : prefersDark);

if (checked.value) {
    document.documentElement.classList.add('my-app-dark');
} else {
    document.documentElement.classList.remove('my-app-dark');
}

const toggleDarkMode = (): void => {
    if (checked.value) {
        document.documentElement.classList.add('my-app-dark');
    } else {
        document.documentElement.classList.remove('my-app-dark');
    }
    localStorage.setItem('dark-mode', checked.value.toString());
};

watch(checked, (newVal: boolean): void => {
    if (newVal) {
        document.documentElement.classList.add('my-app-dark');
    } else {
        document.documentElement.classList.remove('my-app-dark');
    }
    localStorage.setItem('dark-mode', newVal.toString());
});
</script>
