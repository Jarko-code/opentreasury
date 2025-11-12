// import {
//     OpenTreasuryObject,
//     OpenTreasuryUser,
//     PageResponse,
//     PageRequest,
//     Query,
//     Sorting,
// } from '@opentreasury/opentreasury-service-api';
// import { OpenTreasuryBusinessEntityService } from './OpenTreasuryBusinessEntityService.js';
// import {
//     OperationDefinition,
//     PageRequest as OpenTreasuryPageRequest,
//     ApiSearchQueryParameter,
//     SearchQueryParameterOperator,
//     ApiSearchQueryParameterType,
//     SearchQuery,
// } from '@livesystems/openplatform-client-ts';
// import { getAdjustedSorting, getPageInfo } from '../utils/utils.js';
// import { EntityOperation } from '../utils/types.js';
// import { copyValuesFromOperationToEntityByOperationDefinition } from '../utils/OperationEntityConvertor/copyValuesFromOperationToEntityByOperationDefinition.js';
// import { createEntitiesFromOperations } from '../utils/OperationEntityConvertor/createEntitiesFromOperations.js';
// import { adjustSearchQueryFromOperationDefinition } from '../utils/SearchQueryUtils/adjustSearchQueryFromOperationDefinition.js';
// import { adjustSearchQueryFromBusinessEntity } from '../utils/SearchQueryUtils/adjustSearchQueryFromBusinessEntity.js';
// import { copyValuesFromEntityToOperationByOperationDefinition } from '../utils/OperationEntityConvertor/copyValuesFromEntityToOperationByOperationDefinition.js';
// import { getOperationDateTimeValue } from '../utils/OperationEntityConvertor/OperationValueGetter/getOperationDateValue.js';
// import ServiceRepository from '../utils/ServiceRepository/ServiceRepository.js';
// import OperationSearchQuery from '../utils/SearchQueryUtils/ServiceSearchQuery.js';
// import AccessControlMapResolver from '../utils/AccessControl/AccessControlMapResolver.js';
// import AccessControlResolver from '../utils/AccessControl/AccessControlResolver.js';
// import AccessControlError from '../utils/AccessControl/AccessControlError.js';
// import ServiceRepositoryCRUD from '../utils/ServiceRepository/ServiceRepositoryCRUD.js';
// import { FIRST_PAGE } from '../utils/constants.js';
//
// export class OpenTreasuryObjectServiceImplementation<T extends OpenTreasuryObject>
//     implements OpenTreasuryBusinessEntityService<T>, ServiceRepositoryCRUD<T, T['id']>
// {
//     public get roleIds(): string[] {
//         return this._actualLoggedUser.roles ?? [];
//     }
//
//     public get userId(): string {
//         return this._actualLoggedUser.id;
//     }
//
//     public get definition(): OperationDefinition {
//         return this._definition;
//     }
//
//     private readonly _acl = new AccessControlMapResolver(this.definition.applicationACL, this.roleIds, false);
//
//     public get ac() {
//         return this._acl;
//     }
//
//     /** The constructor of the `BusinessEntity`. */
//     public get ctor(): { new (): T } {
//         return this._ctor;
//     }
//
//     /** Wrapper for `openplatform-client-ts` `EntityService`. */
//     public get repository() {
//         return this._repository;
//     }
//
//     /** As of now creates base OperationSearchQuery
//      * @deprecated Use factory method instead
//      * @see createOperationQueryParameter
//      */
//     public get mainSearchQuery(): OperationSearchQuery {
//         return new OperationSearchQuery(Object.fromEntries([this.createOperationQueryParameter()]));
//     }
//
//     /** @deprecated Alias for `ctor`. For compat purposes. */
//     public get type(): { new (): T } {
//         return this._ctor;
//     }
//
//     /** Security group is required from opentreasury as base rule for access control. */
//     public get securityGroupId(): string {
//         return this._securityGroupId;
//     }
//
//     constructor(
//         private readonly _definition: OperationDefinition,
//         private readonly _ctor: { new (): T },
//         private readonly _repository: ServiceRepository,
//         private readonly _securityGroupId: string,
//         private readonly _actualLoggedUser: OpenTreasuryUser,
//     ) {}
//
//     private createOperationQueryParameter(): [string, ApiSearchQueryParameter] {
//         return [
//             'operationDefinition',
//             new ApiSearchQueryParameter(SearchQueryParameterOperator.EQ, ApiSearchQueryParameterType.STRING, this.definition.id),
//         ];
//     }
//
//     private createRoleACQueryParameters(rule: boolean = true, negation: boolean = false): [string, ApiSearchQueryParameter][] {
//         return this.roleIds.map((id) => [
//             `roleApplicationACL.${id}.read`,
//             new ApiSearchQueryParameter(SearchQueryParameterOperator.EQ, ApiSearchQueryParameterType.BOOLEAN, String(rule), negation),
//         ]);
//     }
//     private createUserACQueryParameters(rule: boolean = true, negation: boolean = false): [string, ApiSearchQueryParameter] {
//         return [
//             `userApplicationACL.${this.userId}.read`,
//             new ApiSearchQueryParameter(SearchQueryParameterOperator.EQ, ApiSearchQueryParameterType.BOOLEAN, String(rule), negation),
//         ];
//     }
//
//     public async read(id: T['id']) {
//         const entity = await this.repository.read(id);
//
//         // const userExceptions = new AccessControlMapResolver(entity.roleApplicationACL, [], true);
//         // const roleExceptions = new AccessControlMapResolver(entity.userApplicationACL, [], true);
//         // const ac = new AccessControlResolver([userExceptions, roleExceptions, this.ac]);
//
//         // if (!ac.canRead) throw new AccessControlError(this._ctor.name, 'read');
//
//         const ent: T = new this.ctor();
//
//         copyValuesFromOperationToEntityByOperationDefinition<T>(entity, ent, this.definition);
//
//         return ent;
//     }
//
//     public async create(entity: T) {
//         const userExceptions = new AccessControlMapResolver(entity.userApplicationACL ?? {}, [this.userId], true);
//         const roleExceptions = new AccessControlMapResolver(entity.roleApplicationACL ?? {}, this.roleIds, true);
//         const ac = new AccessControlResolver([userExceptions, roleExceptions, this.ac]);
//
//         if (!ac.canCreate) throw new AccessControlError(this._ctor.name, 'create');
//
//         const operationToCreate: EntityOperation = {
//             id: entity.id || null,
//             name: entity.name,
//             source: entity.source,
//             creator: entity.creator || null,
//             updatedBy: entity.updatedBy || null,
//             createdTimestamp: getOperationDateTimeValue(entity.createdTimestamp),
//             updatedTimestamp: getOperationDateTimeValue(entity.updatedTimestamp),
//             operationDefinition: this.definition.id,
//             securityGroup: this.securityGroupId,
//             content: {},
//             userApplicationACL: entity.userApplicationACL ?? {},
//             roleApplicationACL: entity.roleApplicationACL ?? {},
//         };
//
//         // Would rewrite in the future, classes as OpenProcurmentObejct are unnessecary
//         copyValuesFromEntityToOperationByOperationDefinition<T>(entity, operationToCreate, this.definition);
//         const operation = await this.repository.create(operationToCreate);
//         const ent: T = new this.ctor();
//         copyValuesFromOperationToEntityByOperationDefinition<T>(operation, ent, this.definition);
//
//         return ent;
//     }
//
//     public async update(entity: T): Promise<T> {
//         const userExceptions = new AccessControlMapResolver(entity.userApplicationACL ?? {}, [this.userId], true);
//         const roleExceptions = new AccessControlMapResolver(entity.roleApplicationACL ?? {}, this.roleIds, true);
//         const ac = new AccessControlResolver([userExceptions, roleExceptions, this.ac]);
//
//         if (!ac.canUpdate) throw new AccessControlError(this._ctor.name, 'update');
//
//         const operationToUpdate: EntityOperation = {
//             id: entity.id || null,
//             name: entity.name,
//             source: entity.source,
//             creator: entity.creator || null,
//             updatedBy: entity.updatedBy || null,
//             createdTimestamp: getOperationDateTimeValue(entity.createdTimestamp),
//             updatedTimestamp: getOperationDateTimeValue(entity.updatedTimestamp),
//             operationDefinition: this.definition.id,
//             securityGroup: this.securityGroupId,
//             content: {},
//             userApplicationACL: entity.userApplicationACL ?? {},
//             roleApplicationACL: entity.roleApplicationACL ?? {},
//         };
//
//         // Would rewrite in the future, classes as OpenProcurmentObejct are unnessecary
//         copyValuesFromEntityToOperationByOperationDefinition<T>(entity, operationToUpdate, this.definition);
//         const operation = await this.repository.update(operationToUpdate);
//         const ent: T = new this.ctor();
//         copyValuesFromOperationToEntityByOperationDefinition<T>(operation, ent, this.definition);
//
//         return ent;
//     }
//
//     public async delete(id: T['id']) {
//         const entity = await this.repository.read(id);
//
//         const userExceptions = new AccessControlMapResolver(entity.userApplicationACL ?? {}, [this.userId], true);
//         const roleExceptions = new AccessControlMapResolver(entity.roleApplicationACL ?? {}, this.roleIds, true);
//         const ac = new AccessControlResolver([userExceptions, roleExceptions, this.ac]);
//
//         if (!ac.canDelete) throw new AccessControlError(this._ctor.name, 'delete');
//
//         await this.repository.delete(id);
//     }
//
//     public async fetchAll(sorting?: Sorting): Promise<T[]> {
//         const queryParams: [string, ApiSearchQueryParameter][] = [
//             this.createOperationQueryParameter(),
//             // 1. CanReadOperation => query and omit(negate) Exception[Role/User] == { read: false }
//             // 2. CannotReadOpration => query Exception[Role/User] == { read: true }
//         ];
//
//         const response = await this.repository.service.getAllRaw(
//             new OperationSearchQuery(Object.fromEntries(queryParams)),
//             FIRST_PAGE,
//             getAdjustedSorting(sorting),
//             Object.fromEntries([
//                 this.createUserACQueryParameters(!this.ac.canRead, this.ac.canRead),
//                 ...this.createRoleACQueryParameters(!this.ac.canRead, this.ac.canRead),
//             ]),
//         );
//
//         return {
//             // Very expensive
//             //@ts-ignore
//             content: createEntitiesFromOperations<T>(response.content, this.type, this.definition),
//             pageInfo: getPageInfo(response),
//         };
//     }
//
//     async fetchPage(options: { query?: Query; page?: PageRequest; sorting?: Sorting }): Promise<PageResponse<T>> {
//         const queryParams: [string, ApiSearchQueryParameter][] = [
//             this.createOperationQueryParameter(),
//             // 1. CanReadOperation => query and omit(negate) Exception[Role/User] == { read: false }
//             // 2. CannotReadOpration => query Exception[Role/User] == { read: true }
//         ];
//
//         const searchQuery = new OperationSearchQuery(Object.fromEntries(queryParams));
//         adjustSearchQueryFromBusinessEntity(options.query, searchQuery);
//         adjustSearchQueryFromOperationDefinition(options.query, searchQuery, this.definition);
//
//         const pageRequest = new OpenTreasuryPageRequest(options.page.page, options.page.size);
//
//         const response = await this.repository.service.getAllRaw(
//             searchQuery,
//             pageRequest,
//             getAdjustedSorting(options.sorting),
//             Object.fromEntries([
//                 this.createUserACQueryParameters(!this.ac.canRead, this.ac.canRead),
//                 ...this.createRoleACQueryParameters(!this.ac.canRead, this.ac.canRead),
//             ]),
//         );
//         return {
//             // Very expensive
//             content: createEntitiesFromOperations<T>(response.content, this.type, this.definition),
//             pageInfo: getPageInfo(response),
//         };
//     }
//
//     /** @deprecated */
//     convertSearchQuery(query?: Query): SearchQuery {
//         const result = structuredClone(this.mainSearchQuery);
//
//         adjustSearchQueryFromBusinessEntity(query, result);
//
//         adjustSearchQueryFromOperationDefinition(query, result, this.definition);
//
//         return result;
//     }
//
//     /** @deprecated */
//     public async fetchById(id: string): Promise<T> {
//         return this.read(id);
//     }
//
//     /** @deprecated */
//     public async save(entity: T): Promise<T> {
//         if (entity.id) {
//             return this.update(entity);
//         }
//         return this.create(entity);
//     }
//
//     /** @deprecated */
//     public async deleteEntity(id: string): Promise<void> {
//         return this.delete(id);
//     }
// }
