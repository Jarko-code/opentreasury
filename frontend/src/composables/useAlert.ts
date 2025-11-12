import { useToast } from 'primevue/usetoast';

export function useAlert() {
    const toast = useToast();

    const success = (title: string, message: string) => {
        toast.add({
            severity: 'success',
            summary: title,
            detail: message,
            life: 3000
        });
    };

    const info = (title: string, message: string) => {
        toast.add({
            severity: 'info',
            summary: title,
            detail: message,
            life: 3000
        });
    };

    const warn = (title: string, message: string) => {
        toast.add({
            severity: 'warn',
            summary: title,
            detail: message,
            life: 3000
        });
    };

    const error = (title: string, message: string) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: message,
            life: 3000
        });
    };

    return {
        success,
        info,
        warn,
        error
    };
}
