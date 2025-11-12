import { createRouter, createWebHashHistory } from 'vue-router';
import routes from '@/router/routes';
import { authorizationGuard } from '@/router/authorization-guard';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
    //Scroll to top
    scrollBehavior(to, from, SavedPosition) {
        if (to.hash) {
            const el = window.location.href.split('#')[1];
            if (el.length) {
                const element = document.getElementById(el);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } else if (SavedPosition) {
            return SavedPosition;
        } else {
            const appElement = document.getElementById('app');
            if (appElement) {
                appElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});

router.beforeEach(authorizationGuard);

export default router;
