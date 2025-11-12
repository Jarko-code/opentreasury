import { defineStore } from 'pinia';
import { useServiceAPI } from '@/service-api';
import type {
    OpenTreasuryRole,
    OpenTreasuryUser,
    OpenTreasuryUserSettings
} from '@opentreasury/opentreasury-service-api';
import { useAuthStore } from './auth';

export interface AdjustedOpenTreasuryUser extends OpenTreasuryUser {
    actualRolesDescriptions?: Array<string>;
}

export const useUserStore = defineStore('users', {
    state: () => ({
        users: [] as AdjustedOpenTreasuryUser[],
        serviceAPI: useServiceAPI(),
        user: {} as AdjustedOpenTreasuryUser,
        preferences: {} as OpenTreasuryUserSettings,
        securityGroups: [] as OpenTreasuryRole[]
    }),
    getters: {
        getUserID:
            (state) =>
            (username: string): string => {
                return state.users.find((user) => user.username === username)?.id ?? '';
            },
        currentSecurityGroupId: (state) => {
            return state.securityGroups?.[0]?.id ?? null;
        }
    },
    actions: {
        async fetchAllUsers(): Promise<void> {
            try {
                this.users = (await this.serviceAPI?.entityServices.userService.fetchAll()) ?? [];
            } catch (error) {
                console.error(error);
            }
        },

        async fetchUserById(userId: string): Promise<void> {
            try {
                const response = await this.serviceAPI.entityServices.userService.fetchById(userId);
                this.user = response;
            } catch (error) {
                console.error('Error in fetchUserById:', error);
            }
        },

        async fetchPreferences(): Promise<void> {
            try {
                const authStore = useAuthStore();
                const username = authStore.actualUsername;
                //todo na tudle servicu pridat metodu "fetchByUserId"
                const response =
                    await this.serviceAPI.entityServices.userSettingsService.fetchById(username);
                this.preferences = response ?? ({} as OpenTreasuryUserSettings);
            } catch (error) {
                console.error('Error in fetchPreferences:', error);
            }
        },

        async updatePreferences(): Promise<void> {
            try {
                await this.serviceAPI.entityServices.userSettingsService.saveEntity(this.preferences);
            } catch (error) {
                console.error('Error in updatePreference:', error);
            }
        },

        // security groups
        async fetchAllSecurityGroups(): Promise<void> {
            try {
                this.securityGroups =
                    (await this.serviceAPI?.entityServices.securityGroupService.fetchAll()) ?? [];
            } catch (error) {
                console.error(error);
            }
        }
    }
});
