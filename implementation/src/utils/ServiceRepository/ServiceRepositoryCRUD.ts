import { OpenTreasuryEntity } from '@opentreasury/opentreasury-service-api';

export default interface ServiceRepositoryCRUD<T extends OpenTreasuryEntity, Id> {
    create(resoure: T): Promise<T>;
    read(resourceId: Id): Promise<T>;
    update(resource: T): Promise<T>;
    delete(resourceId: Id): Promise<void>;
}
