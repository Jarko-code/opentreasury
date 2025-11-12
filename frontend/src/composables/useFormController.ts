import { ref } from 'vue';
import type { FormSubmitEvent } from '@primevue/forms';

export const useFormController = <T extends object>(
    emit: (event: 'submit', payload: { valid: boolean; values: T; options?: any }) => void,
    formModel: T
) => {
    const formRef = ref<any>();

    const onSubmit = (evt: FormSubmitEvent<T>) => {
        const submitValue = (evt.originalEvent as SubmitEvent)?.submitter?.getAttribute('value');
        // použijeme hodnoty priamo z formRef alebo evt
        const currentValues = evt?.values ?? formRef.value?.getValues?.() ?? formModel;
        emit('submit', {
            valid: evt.valid,
            values: currentValues,
            options: submitValue ? { submitValue } : undefined
        });
    };

    const exposeFns = {
        validate: () => formRef.value?.validate?.(),
        setValues: (values: T) => formRef.value?.setValues?.(values),
        getValues: () => formRef.value?.getValues?.() ?? formModel
    };

    return {
        formRef,
        onSubmit: onSubmit as (evt: FormSubmitEvent) => void, // prime vue is complaing in Form because of the <T> otherwise.
        exposeFns
    };
};
