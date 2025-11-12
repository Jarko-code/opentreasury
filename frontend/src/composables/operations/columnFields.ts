import { computed, toRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import type { StaticColumns } from '@/types/operations/columns';
import type { DynaProperty } from '@livesystems/openplatform-client-ts/lib/Modules/DynaModel/DynaProperty';

/**
 * Dynamicky generuje informácie o stĺpcoch pre tabuľku operácií.
 * Typy polí sa určujú podľa definície (dynaProperties).
 */
export const useOperationColumns = (definition?: any) => {
    const { t } = useI18n();

    // statické stĺpce s i18n
    const staticColumns = computed<StaticColumns[]>(() => [
        { name: 'id', displayName: t('operations.columns.id') || 'ID' },
        { name: 'name', displayName: t('operations.columns.name') || 'Name' },
        { name: 'actualStatus', displayName: t('operations.columns.status') || 'Status' },
        { name: 'source', displayName: t('operations.columns.source') || 'Zdroj' },
        {
            name: 'createdTimestamp',
            displayName: t('operations.columns.created') || 'Vytvorené',
            isDate: true
        }
    ]);

    // všetky dynamické properties z definície
    const dynaProps = computed<DynaProperty<any>[]>(() => {
        if (!definition?.value?.model) return [];
        const rawProps = toRaw(definition.value.model.dynaProperties) ?? {};
        return Object.values(rawProps) as DynaProperty<any>[];
    });

    // dátumové polia
    const dateFields = computed(
        () =>
            dynaProps.value
                .filter((prop) => prop.details?.type?.toUpperCase?.() === 'DATE')
                .map((prop) => prop.name)
                .concat(['createdTimestamp', 'updatedTimestamp']) // doplnené statické polia
    );

    // číselné polia (DECIMAL, NUMBER, INTEGER)
    const numberFields = computed(() =>
        dynaProps.value
            .filter((prop) => {
                const type = prop.details?.type?.toUpperCase?.();
                return type === 'DECIMAL' || type === 'NUMBER' || type === 'INTEGER';
            })
            .map((prop) => prop.name)
    );

    // boolean polia
    const booleanFields = computed(() =>
        dynaProps.value
            .filter((prop) => prop.details?.type?.toUpperCase?.() === 'BOOLEAN')
            .map((prop) => prop.name)
    );

    // enum polia
    const enumFields = computed(() =>
        dynaProps.value
            .filter((prop) => prop.details?.type?.toUpperCase?.() === 'ENUM')
            .map((prop) => prop.name)
    );

    // string polia = všetky čo nie sú date/number/boolean
    const stringFields = computed(() => {
        const excluded = new Set([
            ...dateFields.value,
            ...numberFields.value,
            ...booleanFields.value
        ]);
        return dynaProps.value.filter((prop) => !excluded.has(prop.name)).map((prop) => prop.name);
    });

    const accountReferenceFields = computed(() => {
        return dynaProps.value
            .filter(
                (prop) =>
                    prop.details?.type === 'ENTITY_REFERENCE' &&
                    prop.details?.entityType?.toLowerCase() === 'account'
            )
            .map((prop) => prop.name);
    });

    const operationReferenceFields = computed(() => {
        return dynaProps.value
            .filter(
                (prop) =>
                    prop.details?.type === 'ENTITY_REFERENCE' &&
                    prop.details?.entityType?.toLowerCase() === 'operation'
            )
            .map((prop) => prop.name);
    });

    const operationCurrencyFields = computed(() => {
        return dynaProps.value
            .filter(
                (prop) =>
                    prop.details?.type === 'ENTITY_REFERENCE' &&
                    prop.details?.entityType?.toLowerCase() === 'currency'
            )
            .map((prop) => prop.name);
    });

    // tu spojíme všetky referencie
    const referenceFields = computed(() => [
        ...accountReferenceFields.value,
        ...operationReferenceFields.value
    ]);

    const getColumnType = (colName: string) => {
        if (dateFields.value.includes(colName)) return 'date';
        if (numberFields.value.includes(colName)) return 'number';
        if (booleanFields.value.includes(colName)) return 'boolean';
        if (referenceFields.value.includes(colName)) return 'reference';
        return 'string';
    };

    return {
        dateFields,
        numberFields,
        booleanFields,
        staticColumns,
        stringFields,
        accountReferenceFields,
        operationReferenceFields,
        referenceFields,
        getColumnType,
        dynaProps,
        operationCurrencyFields,
        enumFields
    };
};
