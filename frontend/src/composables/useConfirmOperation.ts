import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import { useAlert } from '@/composables/useAlert';

type OperationAction = () => Promise<void> | void;

export const useConfirmOperation = () => {
    const confirm = useConfirm();
    const { t } = useI18n();
    const { success, info } = useAlert();

    const confirmOperation = (operationAction: OperationAction): void => {
        confirm.require({
            message: t('default.operationMessage'),
            header: t('default.operationHeader'),
            icon: 'pi pi-info-circle',
            rejectLabel: t('default.operationCancel'),
            rejectProps: {
                label: t('default.operationCancel'),
                severity: 'secondary',
                outlined: true
            },
            acceptProps: {
                label: t('default.operation'),
                severity: 'warn'
            },
            accept: async () => {
                try {
                    await operationAction();
                    success(t('default.success'), t('default.operationSuccess'));
                } catch (error) {
                    console.error('Failed to run operation:', error);
                }
            },
            reject: () => info(t('default.rejected'), t('default.rejectedMessage'))
        });
    };

    return { confirmOperation };
};
