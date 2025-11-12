import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import { useAlert } from '@/composables/useAlert';

type DeleteAction<T = unknown> = (id: T) => Promise<void> | void;

export const useDeleteConfirm = () => {
    const confirm = useConfirm();
    const { t } = useI18n();
    const { success, info } = useAlert();

    const confirmDelete = <T = number | string>(deleteAction: DeleteAction<T>, id: T): void => {
        confirm.require({
            message: t('default.deleteMessage'),
            header: t('default.deleteHeader'),
            icon: 'pi pi-info-circle',
            rejectLabel: t('default.deleteCancel'),
            rejectProps: {
                label: t('default.deleteCancel'),
                severity: 'secondary',
                outlined: true
            },
            acceptProps: {
                label: t('default.delete'),
                severity: 'danger'
            },
            accept: async () => {
                try {
                    await deleteAction(id);
                    success(t('default.removed'), t('default.removedMessage'));
                } catch (error) {
                    console.error('Failed to delete entity:', error);
                }
            },
            reject: () => info(t('default.rejected'), t('default.rejectedMessage'))
        });
    };

    return { confirmDelete };
};
