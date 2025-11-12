<template>
    <div class="language-switcher" ref="languageListRef" @click="toggleLanguageList">
        <div class="current-language">
            <img :src="`flags/${$i18n.locale}.svg`" />
            <p class="text-color-secondary">
                <b>{{ $i18n.locale.toUpperCase() }}</b>
            </p>
            <i
                class="pi pi-angle-down text-color-secondary"
                :class="[rotate ? 'rotatedown' : 'rotateup']"
            />
        </div>

        <div
            class="text-sm cursor-pointer absolute top-[40px] shadow rounded z-50"
            v-show="isLangVisible"
        >
            <ul>
                <li
                    v-for="(language, index) in LANGS"
                    :key="index"
                    @click.stop="changeLocale(language.label)"
                    class="flex align-items-center p-2 hover:bg-gray-100"
                >
                    <img :src="`flags/${language.icon}.svg`" />
                    <p class="m-0 ml-2 font-bold">
                        {{ language.label.toUpperCase() }}
                    </p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { LANGS } from '@/i18n/langs';

const { locale } = useI18n();

const isLangVisible = ref<boolean>(false);
const rotate = ref<boolean>(false);

const languageListRef = ref<HTMLElement | null>(null);

const toggleLanguageList = (): void => {
    isLangVisible.value = !isLangVisible.value;
    rotate.value = isLangVisible.value;
};

const changeLocale = (val: string): void => {
    locale.value = val;
    isLangVisible.value = false;
    rotate.value = false;
};

const handleClickOutside = (event: MouseEvent): void => {
    if (languageListRef.value && !languageListRef.value.contains(event.target as Node)) {
        isLangVisible.value = false;
        rotate.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss" scoped>
.language-switcher {
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;

    .current-language {
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: relative;
        padding: 5px 0;
        width: 90px;
        border-radius: 4px;
        background: var(--langswitch-bg);
        p {
            margin: 0;
            color: var(--primary-color);
            font-weight: bold;
        }
        img {
            width: 21px;
            height: auto;
        }
        i {
            color: var(--langswitch-text-secondary);
            transition: transform 0.35s ease;
        }
    }

    /* Dropdown */
    > div {
        background: var(--langswitch-bg);
        ul {
            list-style: none;
            margin: 0;
            padding: 0;

            li {
                display: flex;
                align-items: center;
                padding: 8px 12px;
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: var(--langswitch-hover-bg);
                }

                img {
                    width: 21px;
                    height: auto;
                }

                p {
                    margin: 0 0 0 8px;
                    font-weight: bold;
                    color: var(--primary-color);
                }
            }
        }
    }
}

/* Rotate icon classes */
.rotatedown {
    transform: rotate(180deg);
}
.rotateup {
    transform: rotate(0deg);
}
</style>
