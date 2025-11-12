import { ObjectLink } from '../../entities/open-treasury-object-link.js';
import { OpenTreasuryEntityServiceApi } from '../open-treasury-entity-service-api.js';

export interface ObjectLinkServiceApi extends OpenTreasuryEntityServiceApi<ObjectLink> {
    fetchByOperationId(operationId: string): Promise<ObjectLink[]>;
    fetchByLinkDefinitionId(linkDefinitionId: string): Promise<ObjectLink[]>;
}
