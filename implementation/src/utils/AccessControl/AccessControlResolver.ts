import AccessControlRules from './AccessControlRules.js';

/**
 * Constructs an AccessControlResolver from an array of any AccessControl class .
 * It selects the first non-empty resolver for each permission (according to the provided order).
 * If no resolver is found for a given permission, it defaults to false.
 *
 * @see AccessControl
 */
export default class AccessControlResolver implements AccessControlRules {
    public readonly canCreate: boolean | undefined;
    public readonly canRead: boolean | undefined;
    public readonly canUpdate: boolean | undefined;
    public readonly canDelete: boolean | undefined;

    public readonly canReadOnly: boolean | undefined = undefined;
    public readonly canCreateOnly: boolean | undefined = undefined;
    public readonly canEdit: boolean | undefined = undefined;
    public readonly canAll: boolean | undefined = undefined;

    private firstPermission(
        resolvers: AccessControlRules[],
        prohibitive: boolean,
        selector: (r: AccessControlRules) => boolean | undefined,
    ): boolean {
        for (const resolver of resolvers) {
            const value = selector(resolver);
            if (value !== undefined) {
                return value;
            }
        }
        return !prohibitive;
    }

    constructor(resolvers: AccessControlRules[], prohibitive: boolean = true) {
        // Precompute the aggregated permissions during construction.
        this.canCreate = this.firstPermission(resolvers, prohibitive, (r) => r.canCreate);
        this.canRead = this.firstPermission(resolvers, prohibitive, (r) => r.canRead);
        this.canUpdate = this.firstPermission(resolvers, prohibitive, (r) => r.canUpdate);
        this.canDelete = this.firstPermission(resolvers, prohibitive, (r) => r.canDelete);

        // Compute common combinations.
        this.canReadOnly = this.canRead && !this.canCreate && !this.canUpdate && !this.canDelete;
        this.canCreateOnly = this.canCreate && !this.canRead && !this.canUpdate && !this.canDelete;
        this.canEdit = this.canCreate && this.canRead && this.canUpdate && !this.canDelete;
        this.canAll = this.canCreate && this.canRead && this.canUpdate && this.canDelete;
    }
}
