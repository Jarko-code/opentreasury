import AccessControlRules from './AccessControlRules.js';
import { ApiOperationACL } from '../../api-types.js';

export default class AccessControlMapResolver implements AccessControlRules {
    public readonly canCreate: boolean | undefined = undefined;
    public readonly canRead: boolean | undefined = undefined;
    public readonly canUpdate: boolean | undefined = undefined;
    public readonly canDelete: boolean | undefined = undefined;
    /** Can read, but cannot create, update, or delete. */
    public readonly canReadOnly: boolean | undefined;
    /** Can create, but cannot read, update, or delete. */
    public readonly canCreateOnly: boolean | undefined;
    /** Can create, read, and update, but cannot delete. */
    public readonly canEdit: boolean | undefined;
    /** Can create, read, update, and delete. */
    public readonly canAll: boolean | undefined;

    constructor(map: Record<string, ApiOperationACL>, roles: string[], prohibitive: boolean = false) {
        const configs: ApiOperationACL[] = [];
        for (const role of roles) {
            if (role in map) {
                configs.push(map[role]);
            }
        }

        if (configs.length != 0) {
            const defaultValue = prohibitive;
            this.canCreate = defaultValue;
            this.canRead = defaultValue;
            this.canUpdate = defaultValue;
            this.canDelete = defaultValue;

            if (prohibitive) {
                for (const config of configs) {
                    if (config.create === false) this.canCreate = false;
                    if (config.read === false) this.canRead = false;
                    if (config.update === false) this.canUpdate = false;
                    if (config.delete === false) this.canDelete = false;
                }
            } else {
                for (const config of configs) {
                    if (config.create === true) this.canCreate = true;
                    if (config.read === true) this.canRead = true;
                    if (config.update === true) this.canUpdate = true;
                    if (config.delete === true) this.canDelete = true;
                }
            }

            this.canReadOnly = !this.canCreate && this.canRead && !this.canUpdate && !this.canDelete;
            this.canCreateOnly = this.canCreate && !this.canRead && !this.canUpdate && !this.canDelete;
            this.canEdit = this.canCreate && this.canRead && this.canUpdate && !this.canDelete;
            this.canAll = this.canCreate && this.canRead && this.canUpdate && this.canDelete;
        }
    }
}
