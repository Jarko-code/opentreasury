<template>
    <main class="flex items-center justify-center min-h-screen bg-class px-4">
        <form
            class="w-full max-w-md flex flex-col gap-4 p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl"
            :style="{ backgroundColor: 'var(--login-form-bg)', color: 'var(--login-form-color)' }"
            @submit.prevent="handleSubmit"
        >
            <div class="flex items-center justify-between">
                <DarkMode />
                <LangSwitcher />
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold text-primary-500 text-center mb-6">
                Open Treasury
            </h1>

            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-user"></i>
                </InputGroupAddon>
                <InputText
                    v-model.trim="userName"
                    :placeholder="t('login.userName')"
                    class="w-full"
                />
            </InputGroup>

            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-lock"></i>
                </InputGroupAddon>
                <InputText
                    v-model.trim="password"
                    type="password"
                    :placeholder="t('login.password')"
                    class="bg-white w-full"
                />
            </InputGroup>

            <Button
                :label="isLoading ? t('login.login2') : t('login.login')"
                type="submit"
                :loading="isLoading"
                class="w-full"
            />
        </form>
    </main>
</template>

<script setup lang="ts">
import { ROUTE_NAMES } from '@/router/names';
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAlert } from '@/composables/useAlert';

const { success, error } = useAlert();

//form inputs
const userName = ref('');
const password = ref('');

const isLoading = ref<boolean>(false);
const router = useRouter();

//define store
const storeAuth = useAuthStore();

const { t } = useI18n();

const handleSubmit = async () => {
    isLoading.value = true;
    try {
        await storeAuth.handleLogin(userName.value, password.value);

        if (storeAuth.isLoggedIn()) {
            success(t('login.success'), t('login.successMessage'));
            router.push({ name: ROUTE_NAMES.dashboardPage });
        } else {
            error(t('login.error'), t('login.errorMessage'));
        }
    } catch (err) {
        error(t('login.error'), t('login.errorMessage'));
    } finally {
        isLoading.value = false;
    }
};
</script>
