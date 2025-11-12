import { DynaProperty } from '@livesystems/openplatform-client-ts/lib/Modules/DynaModel/DynaProperty';

export interface StaticColumns {
    name: string;
    displayName: string;
    isDate?: boolean;
    isNumber?: boolean;
    isBoolean?: boolean;
    format?: (value: unknown) => string;
}

export type ColumnDef =
    | (StaticColumns & {
          name: string;
          displayName: string;
          type: 'string' | 'number' | 'date' | 'boolean' | 'reference';
          format?: (value: unknown) => string;
      })
    | (DynaProperty<any> & {
          name: string;
          displayName: string;
          type: 'string' | 'number' | 'date' | 'boolean' | 'reference';
      });
