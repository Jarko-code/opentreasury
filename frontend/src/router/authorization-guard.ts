import { useAuthStore } from '@/stores/auth';
import { ROUTE_NAMES } from '@/router/names';
import type { NavigationGuard } from 'vue-router';

export const authorizationGuard: NavigationGuard = async (to) => {
    const storeAuth = useAuthStore();

    if (!storeAuth.isLoggedIn()) await storeAuth.tryAuthorization();

    if (
        // make sure the user is authenticated
        (!storeAuth.isLoggedIn() || ('public' in to.meta && to.meta?.public != true)) &&
        // Avoid an infinite redirect
        to.name !== ROUTE_NAMES.loginPage
    ) {
        // redirect the user to the login page
        return { name: ROUTE_NAMES.loginPage };
    }
};
