import type { ServiceApi } from '@opentreasury/opentreasury-service-api';
import { OpenTreasuryServiceApi } from '@opentreasury/opentreasury-service-implementation-ot';
import { inject } from 'vue';

const serviceAPI: OpenTreasuryServiceApi = new OpenTreasuryServiceApi('/api');

export type ServiceAPI = ServiceApi;

/**
 * Injects service API
 *
 * @example
 * const serviceAPI = useServiceAPI()
 * serviceAPI.login('username', 'password')
 */
export function useServiceAPI(): ServiceAPI {
    const api = inject<ServiceAPI | undefined>(SERVICE_API_SYM, undefined);
    if (!api) {
        throw new Error('Service is not defined.');
    }
    return api;
}

/**
 * Symbol that is used as a key in `provide()` method of Vue app
 */
export const SERVICE_API_SYM: unique symbol = Symbol();

export default serviceAPI;
