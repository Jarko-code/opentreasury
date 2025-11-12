import { useI18n } from 'vue-i18n';
import type { InputValidationFromScript } from '@/views/operations/OperationEditPage.vue';

export const useResolvers = () => {
    const { t } = useI18n();

    const operationResolver = (
        options: any,
        invalidInputsWithMessage: Array<InputValidationFromScript>
    ) => {
        const allInputsToCheck = ['name'];

        const values = options?.values as Record<string, any>;

        const errors: Record<string, { message: string }[]> = {};

        allInputsToCheck.forEach((inputName) => {
            if (values && (!values[inputName] || !values[inputName].trim())) {
                errors[inputName] = [
                    {
                        message: t('validations.requiredField')
                    }
                ];
            }
        });

        invalidInputsWithMessage.forEach(({ field, message }) => {
            errors[field] = [
                {
                    message: message ?? t('validations.requiredField')
                }
            ];
        });


        return { errors, valid: Object.keys(errors).length === 0 };
    };

    return {
        operationResolver
    };
};
