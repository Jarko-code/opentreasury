import { toRaw } from 'vue';
import { useOperationsStore } from '@/stores/useOperationsStore';
import { useOperationLinkDefinitionsStore } from '@/stores/useOperationLinkDefinitionsStore';
import { useUserStore } from '@/stores/user-store';
import { useAlert } from '@/composables/useAlert';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

export const useOperationSaveHandler = (definition: any) => {
    const operationsStore = useOperationsStore();
    const operationLinkDefinitionsStore = useOperationLinkDefinitionsStore();
    const userStore = useUserStore();
    const { success, error } = useAlert();
    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n();

    const handleSave = async (
        { valid, values }: { valid: boolean; values: Record<string, any> },
        options?: { mode?: 'new' | 'clone' }
    ) => {
        if (!valid) return;

        if (!userStore.securityGroups.length) {
            await userStore.fetchAllSecurityGroups();
        }

        const securityGroupId = userStore.currentSecurityGroupId;
        console.log('VALUES PRED SAVE:', values);

        const raw = toRaw(values);
        const { name, source, actualStatus, ...dynaProps } = raw;

        // odstráňme polia, ktoré sa nemajú kopírovať
        if (options?.mode === 'clone') {
            delete dynaProps.id;
            delete dynaProps.createdTimestamp;
            delete dynaProps.updatedTimestamp;
            delete dynaProps.creator;
            delete dynaProps.updatedBy;
        }

        const payload = {
            name,
            source: source || 'frontend',
            actualStatus:
                !actualStatus || actualStatus.toLowerCase() === 'n/a' ? null : actualStatus,
            operationDefinition: definition.value?.id ?? '',
            securityGroup: securityGroupId || undefined,
            creator: null,
            updatedBy: null,
            createdTimestamp: null,
            updatedTimestamp: null,
            content: { ...dynaProps }
        };
        console.log(payload);

        try {
            console.dir(payload);
            const saved = await operationsStore.saveOperation(payload);
            // console.log('Saved operation:', saved);

            const savedId = saved?.id;

            if (!savedId) {
                console.error('Missing saved ID', saved);
                error('Chyba', 'Nepodarilo sa získať ID novej operácie.');
                return;
            }

            // získaj prelinkovacie údaje (pôvodná operácia + link definícia)
            const linkedTo =
                (route.query.linkedTo as string | undefined) ||
                (route.params.operationId as string | undefined);
            const linkDefId =
                (route.query.linkDef as string | undefined) ||
                (route.params.definitionId as string | undefined);

            if (linkedTo && linkDefId) {
                const linkPayload = {
                    linkDefinition: linkDefId,
                    primarySide: linkedTo,
                    secondarySide: savedId
                };

                // console.log('Creating operation link with payload:', linkPayload);
                try {
                    await operationLinkDefinitionsStore.saveOperationLink(linkPayload);
                    // console.log('Linked operation created successfully');
                } catch (linkErr) {
                    console.error('Failed to create link:', linkErr);
                    error(t('default.failed'), t('operations.form.linkCreateFailed'));
                }
            }

            success(t('default.created'), t('operations.form.created'));

            router.go(-1);
        } catch (err) {
            console.error('Error while saving operation:', err);
            error(t('default.failed'), t('operations.form.createFailed'));
        }
    };

    return { handleSave };
};
