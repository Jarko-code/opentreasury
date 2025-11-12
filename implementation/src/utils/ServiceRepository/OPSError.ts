export default class OPSError extends Error {
    constructor(message?: string, options?: { cause?: Error }) {
        const msg = message ? `[OpenTreasuryService] ${message}` : undefined;
        super(msg, options);
        this.name = 'OPSError';
    }
}
