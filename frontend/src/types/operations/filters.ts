import type { UiQuery } from '@opentreasury/opentreasury-service-api';

export interface FilterDef {
    operator: string;
    value: any; // môžeš zjemniť: string | { from: string; to: string } | boolean
}

export type TableQuery = Record<string, UiQuery>;
