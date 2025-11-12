import { ApiEntity } from '../api-types.js';

export type Nullable<T> = T | null;
export type ParamMap<T> = {
    [key in keyof T]?: string;
};

export interface EntityOperation extends ApiEntity {
    id: Nullable<string>;
    name: Nullable<string>;
    source: Nullable<string>;
    updatedBy?: Nullable<string>;
    updatedTimestamp?: Nullable<string>;
    createdTimestamp?: Nullable<string>;
    creator?: Nullable<string>;
    operationDefinition: string;
    securityGroup: string;
    content: Record<string, string | number | boolean | null>;
}

export interface UserGroup {
    id: string;
    members: string[];
    systemName: string;
}
