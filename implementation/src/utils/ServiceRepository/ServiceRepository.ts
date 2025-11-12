import OPSError from './OPSError.js';
import ServiceRepositoryCRUD from './ServiceRepositoryCRUD.js';
import { OpenTreasuryEntity } from '@opentreasury/opentreasury-service-api';
import { ApiEntity, ApiEntityService, ApiOperationDefinition } from '../../api-types.js';

/**
 * Handles REST API calls to backend.
 */
export default class ServiceRepository implements ServiceRepositoryCRUD<OpenTreasuryEntity, ApiEntity['id']> {
    public get service(): ApiEntityService {
        return this._service;
    }

    public get definition(): ApiOperationDefinition {
        return this._definition;
    }

    constructor(
        private readonly _service: ApiEntityService,
        private readonly _definition: ApiOperationDefinition,
    ) {}

    public async read(id: ApiEntity['id']) {
        try {
            return await this.service.get(id);
        } catch (error) {
            throw new OPSError(`Error reading entity with id ${id}.`, { cause: error });
        }
    }

    public async create(entity: ApiEntity) {
        try {
            const response = await this.service.save(entity);
            // if (response.details?.id !== entity?.id) {
            //     throw new OPSError(
            //         `ApiEntity creation failed: response id ${response.details?.id} does not match provided entity id ${entity?.id}.`,
            //     );
            // }
            return await this.service.get(response.details?.id as string);
        } catch (error) {
            throw new OPSError('Error creating entity.', { cause: error });
        }
    }

    public async update(entity: ApiEntity) {
        if (!entity.id) {
            throw new OPSError("ApiEntity update failed: entity does not have an 'id'.");
        }
        try {
            return await this.create(entity);
        } catch (error) {
            throw new OPSError(`Error updating entity with id ${entity.id}.`, { cause: error });
        }
    }

    public async delete(id: ApiEntity['id']) {
        try {
            await this.service.delete({ id });
        } catch (error) {
            throw new OPSError(`Error deleting entity with id ${id}.`, { cause: error });
        }
    }
}
