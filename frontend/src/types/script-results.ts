import type { InputValidationFromScript } from '@/views/operations/OperationEditPage.vue';

export const SCRIPT_RESULTS_ACTIONS = {
    CREATE_NEW: 'CREATE_NEW',
    MODIFY_CURRENT: 'MODIFY_CURRENT',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    DEFAULTS: 'DEFAULTS',
} as const;

export type ScriptResultAction = keyof typeof SCRIPT_RESULTS_ACTIONS;

export type ScriptResult = {
    action?: ScriptResultAction;
    payload?: Record<string, unknown> | Array<InputValidationFromScript>;
};
