<template>
    <header class="header px-5 h-12 flex items-center justify-between">
        <!-- Logo / názov -->
        <RouterLink exact-active-class="active" :to="`/ot/${ROUTE_NAMES.dashboardPage}`">
            <div class="flex items-center">
                <h2 class="text-2xl font-bold">Open Treasury</h2>
            </div>
        </RouterLink>

        <div class="flex items-center">
            <div class="md:hidden cursor-pointer mr-4" @click="togglePanel($event)">
                <i class="pi pi-bars text-xl"></i>
            </div>

            <OverlayPanel ref="panelRef" class="block">
                <div class="flex flex-col items-center gap-4 p-2 min-w-[150px]">
                    <DarkMode />
                    <LangSwitcher />
                </div>
            </OverlayPanel>
            <div class="hidden md:flex items-center">
                <DarkMode class="mr-4" />
                <LangSwitcher class="mr-4" />
            </div>
            <RouterLink
                v-if="userId"
                :to="`/ot/administration/users/${userId}`"
                class="cursor-pointer hover:underline"
            >
                {{ actualUsername }}
            </RouterLink>
            <Button
                :label="t('default.logout')"
                icon="pi pi-sign-out"
                variant="text"
                severity="danger"
                @click="handleLogout"
            />
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ROUTE_NAMES } from '@/router/names';
import { useAuthStore } from '@/stores/auth';
import { useAlert } from '@/composables/useAlert';
import { useI18n } from 'vue-i18n';

const { info } = useAlert();
const { t } = useI18n();

const panelRef = ref();
const togglePanel = (event: Event) => {
    panelRef.value.toggle(event);
};

const authStore = useAuthStore();
const { logOut, actualUsername, userId } = authStore;

const handleLogout = () => {
    logOut();
    info(t('login.logout'), t('login.logoutMessage'));
};
</script>
