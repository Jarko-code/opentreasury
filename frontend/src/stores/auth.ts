import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import router from '@/router';
import { LoginStatus } from '@opentreasury/opentreasury-service-api';
import { useServiceAPI } from '@/service-api';
import { useUserStore } from './user-store';

export const useAuthStore = defineStore('auth', () => {
    //state
    const actualUsername = ref('');
    const serviceAPI = useServiceAPI();
    const isAuthenticated = ref(false);
    const actualUserId = ref('');

    //actions
    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await serviceAPI?.authorization.login(username, password);
            isAuthenticated.value = response.status === LoginStatus.AUTHORIZED;
            await useUserStore().fetchAllUsers();
            actualUsername.value = response.user?.username ?? '';
        } catch (error) {
            console.error(error);
            isAuthenticated.value = false;
        }
    };

    const tryAuthorization = async () => {
        try {
            const response = await serviceAPI?.authorization.tryAuthorization();
            isAuthenticated.value = response.status === LoginStatus.AUTHORIZED;
            await useUserStore().fetchAllUsers();
            actualUsername.value = response.user?.username ?? '';
        } catch (error) {
            console.error(error);
            isAuthenticated.value = false;
        }
    };

    const logOut = () => {
        try {
            serviceAPI?.authorization.logout();
            actualUsername.value = '';
        } catch (error) {
            console.error(error);
        } finally {
            isAuthenticated.value = false;
            router.push('/');
        }
    };

    //getters
    const isLoggedIn = () => {
        return isAuthenticated.value;
    };

    const loggedUser = computed(() =>
        useUserStore().users.find((user) => user.username === actualUsername.value)
    );

    const userId = computed(() => {
        return useUserStore().getUserID(actualUsername.value);
    });

    return {
        //state
        openApi: serviceAPI,
        isAuthenticated,
        actualUsername,
        //actions
        handleLogin,
        tryAuthorization,
        logOut,
        //getters
        isLoggedIn,
        // loggedUser,
        userId,
        loggedUser,
        actualUserId
    };
});
