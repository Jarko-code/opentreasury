import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export const useAuditFields = () => {
    const { t } = useI18n();

    const auditFields = computed(() => [
        {
            name: 'creator',
            displayName: t('operations.form.creator') || 'Vytvoril'
        },
        {
            name: 'createdTimestamp',
            displayName: t('operations.form.createdTime') || 'Dátum vytvorenia',
            isDate: true
        },
        {
            name: 'updatedBy',
            displayName: t('operations.form.updatedBy') || 'Upravil'
        },
        {
            name: 'updatedTimestamp',
            displayName: t('operations.form.updatedAt') || 'Dátum úpravy',
            isDate: true
        },
        {
            name: 'securityGroup',
            displayName: t('operations.form.securityGroup') || 'Security skupina'
        }
    ]);

    return {
        auditFields
    };
};
