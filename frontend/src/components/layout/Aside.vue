<template>
    <aside
        :class="[
            'aside py-5 transition-all duration-300 overflow-auto',
            isMobile ? 'w-16 max-h-screen' : 'w-60 max-h-screen'
        ]"
    >
        <PanelMenu
            v-if="!isMobile"
            :model="NAVIGATION"
            class="w-full max-h-full"
            style="max-height: 100vh"
            multiple
        >
            <template #item="{ item }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a
                        v-ripple
                        :style="
                            href.endsWith($route.path)
                                ? {
                                      backgroundColor: 'var(--menu-active-bg)',
                                      color: 'var(--login-form-color)'
                                  }
                                : { color: 'var(--login-form-color)' }
                        "
                        :class="[
                            'flex items-center cursor-pointer text-surface-700 dark:text-surface-0 px-4 py-2',
                            { 'font-bold': href.endsWith($route.path) }
                        ]"
                        :href="href"
                        @click="navigate"
                    >
                        <span :class="item.icon" />
                        <span class="ml-2">{{ item.label }}</span>
                    </a>
                </router-link>

                <a
                    v-else
                    v-ripple
                    class="flex items-center cursor-pointer text-surface-700 dark:text-surface-0 px-4 py-2"
                    :href="item.url"
                    :target="item.target"
                >
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                    <span v-if="item.items" class="pi pi-angle-down text-primary ml-auto" />
                </a>
            </template>
        </PanelMenu>

        <div v-else class="space-y-6 px-2 max-h-full overflow-auto">
            <div v-for="category in NAVIGATION" :key="category.label">
                <h3
                    v-if="category.label"
                    class="text-xs font-semibold text-gray-500 mb-2 select-none text-center"
                    :title="category.label"
                >
                    {{ category.label }}
                </h3>
                <ul class="flex flex-col space-y-2">
                    <li
                        v-for="item in flattenCategory(category)"
                        :key="item.label"
                        class="flex justify-center"
                    >
                        <router-link
                            v-if="item.route"
                            v-slot="{ href, navigate }"
                            :to="item.route"
                            custom
                        >
                            <a
                                class="flex justify-center w-full p-2 rounded hover:bg-gray-100"
                                :class="{
                                    'bg-gray-200 dark:bg-gray-700': href.endsWith($route.path)
                                }"
                                v-tooltip.right="item.label"
                                :aria-label="item.label"
                                :href="href"
                                @click="navigate"
                            >
                                <i :class="item.icon + ' text-xl'" />
                            </a>
                        </router-link>
                        <a
                            v-else-if="item.url"
                            class="flex justify-center w-full p-2 rounded hover:bg-gray-100"
                            v-tooltip.right="item.label"
                            :aria-label="item.label"
                            :href="item.url"
                            :target="item.target"
                        >
                            <i :class="item.icon + ' text-xl'" />
                        </a>
                        <button
                            v-else
                            class="flex justify-center w-full p-2 rounded hover:bg-gray-100"
                            v-tooltip.right="item.label"
                            :aria-label="item.label"
                        >
                            <i :class="item.icon + ' text-xl'" />
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoutes } from '@/composables/useRoutes';

import type { AppMenuItem } from '../../types/menu';

const { NAVIGATION } = useRoutes();

const isMobile = ref<boolean>(window.innerWidth < 768);

const handleResize = () => {
    isMobile.value = window.innerWidth < 768;
};

onMounted(() => window.addEventListener('resize', handleResize));

onBeforeUnmount(() => window.removeEventListener('resize', handleResize));

const flattenCategory = (category: AppMenuItem): AppMenuItem[] => {
    const res: AppMenuItem[] = [];
    function flatten(items: AppMenuItem[]) {
        items.forEach((i) => {
            res.push(i);
            if (i.items) flatten(i.items);
        });
    }
    flatten(category.items || []);
    return res;
};
</script>

<style scoped>
.aside {
    /* Ensure aside uses full viewport height for scrolling */
    height: 100vh;
    /* Optional: add scrollbar styles */
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}
.aside::-webkit-scrollbar {
    width: 6px;
}
.aside::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}
</style>
