export type Id = string | number;

export interface TableActions {
    id: Id;
    showCopy?: boolean;
    showDelete?: boolean;
    showOperation?: boolean;
    showEdit?: boolean;
    copyTooltip?: string;
    deleteTooltip?: string;
    operationTooltip?: string;
    editTooltip?: string;
}
