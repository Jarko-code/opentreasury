import { ApiSearchQuery, ApiSearchQueryParameter } from '../../api-types.js';

/**
 * Class that uses openplatform-client-ts EntityService
 */
export default class ServiceSearchQuery extends ApiSearchQuery {
    constructor(parameters: Record<string, ApiSearchQueryParameter>) {
        super('', '', 'operation', false, '', parameters);
    }
}
