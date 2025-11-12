import { useUserStore } from '@/stores/user-store';

export const findUserNameById = (id: string | null | undefined) => {
    const userStore = useUserStore();

    if (!id) return '';
    const user = userStore.users?.find?.((u: any) => u.id === id);
    return user?.username || id;
};
