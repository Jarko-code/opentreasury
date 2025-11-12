import { entityServiceGenerator } from '@/helpers/entity-services/entity-service-generator.ts';
import serviceAPI from '@/service-api.ts';
import type { OpenTreasuryAccount } from '@opentreasury/opentreasury-service-api';

const accountService = entityServiceGenerator<OpenTreasuryAccount>(
    serviceAPI.entityServices.accountService
);


export {
    accountService,
}
