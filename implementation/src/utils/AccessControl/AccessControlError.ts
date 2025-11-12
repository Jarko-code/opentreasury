export default class AccessControlError extends Error {
    constructor(operation: string, CRUDOperation: string) {
        super(`[AccessControl->${operation}] Access denied for operation: ${CRUDOperation}.`);
        this.name = 'AccessControlError';
    }
}
