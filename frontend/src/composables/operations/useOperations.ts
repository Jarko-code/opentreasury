import { useOperationsStore } from '@/stores/useOperationsStore';
import type { Nullable } from '@opentreasury/opentreasury-service-api/dist/utils/utils';
import type { OpenTreasuryObjectDefinition } from '@opentreasury/opentreasury-service-api';

export function useOperations() {
    const operationsStore = useOperationsStore();

    function resolveOperationName(id: string): string {
        return operationsStore.getOperationName(id);
    }

    //TODO import from service layer
    function adjustOperation(
        definition: OpenTreasuryObjectDefinition,
        sourceObject: Record<string, unknown>
    ) {
        const result = {} as Record<string, unknown>;
        Object.entries(definition?.model.dynaProperties).forEach(([name, property]) => {
            const propertyType = property.details?.type;
            const value = sourceObject[name];
            switch (propertyType) {
                case 'DATE_TIME':
                case 'DATE':
                    result[name] = getDateValue(value as Nullable<Date>);
                    break;
                // case 'DECIMAL':
                //     result[name] = getDecimalValue(value, property);
                //     break;
                default:
                    result[name] = value;
                    break;
            }
        });

        return result;
    }

    function getDateValue(value: Nullable<Date>) {
        return value ? new Date(value) : null;
    }

   

    return {
        adjustOperation,
        resolveOperationName
    };
}
