import { ref, computed, watch } from 'vue';
import { formatDateForBackend } from '@/helpers/formatDate';
import { addDays } from 'date-fns';
import type { ColumnDef } from '@/types/operations/columns';
import type { FilterDef, TableQuery } from '@/types/operations/filters';
import { useAccountsStore } from '@/stores/accountsStore';
import type { OpenTreasuryOperation } from '@opentreasury/opentreasury-service-api';

export function useFilters({
    dynaProps,
    operationsStore,
    tableFilters,
    t,
    confirmDelete,
    definition,
    success,
    error
}: any) {
    // refs pre filter popup a aktívny stĺpec
    const filterPopup = ref();
    const activeColumn = ref<ColumnDef | null>(null);

    // všetky filtre
    const filters = ref<Record<string, FilterDef>>({});

    // buffer pre string input
    const localValue = ref('');

    // pre aktuálny filter
    const selectedOperator = ref(null);
    const filterValue = ref(null);

    const showClearAll = ref(false);

    // uložené filtre
    const selectedFilter = ref<string | null>(null);
    const newFilterName = ref('');

    // definície operátorov
    const operators = computed(() => ({
        number: [
            { label: '=', value: 'equals' },
            { label: '>', value: 'gt' },
            { label: '<', value: 'lt' },
            { label: '≥', value: 'gte' },
            { label: '≤', value: 'lte' },
            { label: t('default.between'), value: 'between' }
        ],
        string: [
            { label: '=', value: 'equals' },
            { label: t('default.like'), value: 'contains' },
            { label: t('default.regex'), value: 'query' }
        ],
        date: [
            { label: '=', value: 'dateIs' },
            { label: '<', value: 'dateBefore' },
            { label: '>', value: 'dateAfter' },
            { label: t('default.between'), value: 'between' }
        ],
        boolean: [
            { label: t('default.true'), value: true },
            { label: t('default.false'), value: false }
        ],
        reference: [
            { label: '=', value: 'equals' },
            { label: t('default.in'), value: 'in' }
        ]
    }));

    // computed pre referencie (accounty, operácie…)
    const referenceOptions = computed<Record<string, { label: string; value: string }[]>>(() => {
        const opts: Record<string, { label: string; value: string }[]> = {};

        if (!Array.isArray(dynaProps?.value)) return opts;

        const accountsStore = useAccountsStore();

        for (const prop of dynaProps.value) {
            if (prop.details?.type !== 'ENTITY_REFERENCE') continue;

            const entityType = prop.details?.entityType?.toLowerCase();
            const propName = prop.name;

            if (entityType === 'account') {
                opts[propName] = Array.from(accountsStore.accounts.keys()).map((id: string) => ({
                    label: accountsStore.getAccountName(id),
                    value: id
                }));
            } else if (entityType === 'operation') {
                const refDefId = prop.details?.entityFilter?.parameters?.operationDefinition?.value;

                if (!refDefId) continue;

                const defMap = operationsStore.operationsByDefinition?.get(refDefId) as
                    | Map<string, OpenTreasuryOperation>
                    | undefined;

                if (!defMap) {
                    opts[propName] = [];
                    continue;
                }

                opts[propName] = Array.from(defMap.values()).map((op: OpenTreasuryOperation) => ({
                    label: op.name ?? op.id ?? '',
                    value: op.id ?? ''
                }));
            }
        }

        return opts;
    });

    // zistenie backend názvu stĺpca
    const getBackendColumnName = (col: string): string => {
        // ak je to dynamická property → prefixni "content.values."
        if (dynaProps.value.some((dp: any) => dp.name === col)) {
            return `content.values.${col}`;
        }
        // inak nechaj pôvodný názov
        return col;
    };

    // otvorenie popupu pre filter
    const openFilter = (col: ColumnDef, event: MouseEvent) => {
        activeColumn.value = col;

        if (!(col.name in filters.value)) {
            filters.value[col.name] = { operator: '', value: '' };
        }

        // buffer → vezmi hodnotu zo storage
        localValue.value = filters.value[col.name].value ?? '';

        filterPopup.value.toggle(event);
    };

    // použitie filtra (transformácia na query pre backend)
    const applyFilter = () => {
        const result: TableQuery = {};

        for (const [col, filter] of Object.entries(filters.value)) {
            // ak je boolean a nemá operator → default na 'in'
            if (typeof filter.value === 'boolean' && !filter.operator) {
                filter.operator = 'in';
            }

            if (!filter.operator || filter.value == null) continue;

            // vyber správny názov pre backend
            const backendCol = getBackendColumnName(col);

            // 🗓️ medzi hodnoty (between → range)
            if (filter.operator === 'between') {
                // zistí, či je hodnota číslo alebo dátum
                const isNumber =
                    typeof filter.value.from === 'number' || typeof filter.value.to === 'number';

                const from =
                    filter.value.from instanceof Date
                        ? formatDateForBackend(filter.value.from)
                        : filter.value.from;

                const to =
                    filter.value.to instanceof Date
                        ? formatDateForBackend(addDays(filter.value.to, 1)) // 👈 posun horného limitu
                        : filter.value.to;

                result[backendCol] = {
                    matchMode: 'between',
                    value: `${from};${to}`,
                    type: isNumber ? 'float' : 'date'
                };
                continue;
            }

            // ✅ booleany → vždy "in" + string "true"/"false"
            if (typeof filter.value === 'boolean') {
                result[backendCol] = {
                    matchMode: 'in',
                    value: filter.value ? 'true' : 'false',
                    type: 'boolean'
                };
                continue;
            }

            // 🔢 čísla → number alebo float podľa prefixu
            if (typeof filter.value === 'number') {
                result[backendCol] = {
                    matchMode: filter.operator,
                    value: filter.value * 100,
                    type: backendCol.startsWith('content.values.') ? 'float' : 'number'
                };
                continue;
            }

            // 🔗 entity reference (výber viacerých možností)
            if (Array.isArray(filter.value)) {
                result[backendCol] = {
                    matchMode: filter.operator,
                    value: filter.value.join(';'), // zoznam id-čiek oddelený ";"
                    type: 'entity'
                };
                continue;
            }

            // 📄 ostatné (string, date, relative date)
            let val = filter.value;
            let type: string | undefined;

            if (filter.value instanceof Date) {
                // absolútny dátum → ISO
                val = formatDateForBackend(filter.value);
                type = 'date';
            } else if (typeof filter.value === 'string') {
                const relativeDateRegex = /^-?\d+(d|w|m|y)$|^(1(bom|lom|bow|low|boy|loy))$/;

                if (relativeDateRegex.test(filter.value)) {
                    type = 'date';
                } else {
                    val = filter.value.toLowerCase();
                    type = 'string';
                }
            }

            result[backendCol] = {
                matchMode: filter.operator,
                value: val,
                ...(type ? { type } : {})
            };
        }

        console.log('Normalized filters for backend:', result);
        //@ts-ignore
        tableFilters.value = result;
        filterPopup.value.hide();
        showClearAll.value = true;
    };

    // vyčistenie jedného filtra
    const clearFilter = (colName: string) => {
        const filter = filters.value[colName];
        if (!filter) return;

        // vyčisti model
        filter.operator = '';
        filter.value = '';

        // resetni aj buffer pre string input
        if (activeColumn.value?.name === colName) {
            localValue.value = '';
        }
    };

    // sleduj zmenu operatora a udržuj správny tvar value
    watch(
        () => {
            const colName = activeColumn.value?.name;
            return colName ? filters.value[colName]?.operator : undefined;
        },
        (newOp) => {
            const col = activeColumn.value?.name;
            if (!col) return;

            if (newOp === 'between' && !filters.value[col].value) {
                filters.value[col].value = { from: null, to: null };
            } else if (
                ['equals', 'notEquals', 'gt', 'lt', 'gte', 'lte'].includes(newOp ?? '') &&
                typeof filters.value[col].value !== 'number'
            ) {
                filters.value[col].value = null;
            }
        }
    );

    // zistí, či daný stĺpec patrí medzi dynamické vlastnosti a vráti správny backend názov
    const getPrefixedColumnName = (col: string): string => {
        return dynaProps?.value?.some((dp: any) => dp.name === col) ? `content.values.${col}` : col;
    };

    // uloženie filtra do backendu
    const saveFilter = async () => {
        if (!newFilterName.value) return;
        if (!definition.value?.id) return; // potrebujeme operationDefinitionId

        const parameters: Record<string, any> = {};

        for (const [col, filter] of Object.entries(filters.value)) {
            if (!filter.operator || filter.value == null) continue;

            const key = getPrefixedColumnName(col);

            // 🗓️ BETWEEN (date alebo number)
            if (filter.operator === 'between') {
                const from =
                    filter.value.from instanceof Date
                        ? formatDateForBackend(filter.value.from)
                        : filter.value.from;

                const to =
                    filter.value.to instanceof Date
                        ? formatDateForBackend(addDays(filter.value.to, 1)) // posun horného limitu
                        : filter.value.to;

                const isNumber =
                    typeof filter.value.from === 'number' || typeof filter.value.to === 'number';

                parameters[key] = {
                    operator: 'between',
                    type: isNumber ? 'number' : 'date',
                    value: `${from};${to}`,
                    negation: false
                };
                continue;
            }

            // ✅ BOOLEAN
            if (typeof filter.value === 'boolean') {
                parameters[key] = {
                    operator: 'in',
                    type: 'boolean',
                    value: filter.value ? 'true' : 'false',
                    negation: false
                };
                continue;
            }

            // 🔢 NUMBER
            if (typeof filter.value === 'number') {
                parameters[key] = {
                    operator: filter.operator,
                    type: 'number',
                    value: filter.value * 100,
                    negation: false
                };
                continue;
            }

            // 🔗 REFERENCE (pole idčiek)
            if (Array.isArray(filter.value)) {
                parameters[key] = {
                    operator: filter.operator === 'equals' ? 'eq' : filter.operator,
                    type: 'entity',
                    value: filter.value.join(';'),
                    negation: false
                };
                continue;
            }

            // 🗓️ DATE
            if (filter.value instanceof Date) {
                parameters[key] = {
                    operator: filter.operator === 'equals' ? 'dateIs' : filter.operator,
                    type: 'date',
                    value: formatDateForBackend(filter.value),
                    negation: false
                };
                continue;
            }

            if (typeof filter.value === 'string') {
                const relativeDateRegex =
                    /^-?\d+(d|w|m|y)$|^(1(bom|lom|bow|low|boy|loy))$|^[^>]+>[^<]+$/;

                if (relativeDateRegex.test(filter.value)) {
                    parameters[key] = {
                        operator: filter.operator === 'equals' ? 'dateIs' : filter.operator,
                        type: 'date',
                        value: filter.value,
                        negation: false
                    };
                    continue;
                }
            }

            // 📄 STRING (fallback)
            parameters[key] = {
                operator: filter.operator,
                type: 'string',
                value: filter.value,
                negation: false
            };
        }

        // pridáme operationDefinition do parameters
        parameters['operationDefinition'] = {
            operator: 'eq',
            type: 'string',
            value: definition.value.id,
            negation: false
        };

        const newFilter = {
            name: newFilterName.value,
            object: 'operation',
            parameters
        };

        try {
            await operationsStore.saveFilter(newFilter as any);
            newFilterName.value = '';
            success(t('default.success'), t('default.successMessage'));
        } catch (err) {
            console.error('Failed to save filter:', err);
            error(t('default.error'), t('default.errorMessage'));
        }
    };

    // zmazanie filtra
    const deleteFilter = async (id: string) => {
        if (!id) return;
        if (!definition.value?.id) return;

        confirmDelete(async (id: string) => {
            await operationsStore.deleteFilter(id);

            if (selectedFilter.value === id) {
                selectedFilter.value = null;
            }

            await operationsStore.fetchAllFilters(definition.value!.id);
        }, id);
    };

    // normalizácia backendového filter objektu
    const normalizeFilterDef = (def: any) => {
        let { operator, type, value, negation } = def;

        // 🗓️ Dátumy
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
            type = 'date';

            const dateOps: Record<string, string> = {
                eq: 'dateIs',
                lt: 'dateBefore',
                gt: 'dateAfter',
                between: 'between'
            };

            operator = dateOps[operator] ?? operator;
            value = new Date(value);
        }

        // 🔢 Čísla
        else if ((type === 'string' || type === 'number') && !isNaN(Number(value))) {
            type = 'number';
            value = Number(value);

            const numberOps: Record<string, string> = {
                eq: 'equals',
                lt: 'lt',
                lte: 'lte',
                gt: 'gt',
                gte: 'gte',
                between: 'between',
                range: 'between'
            };

            operator = numberOps[operator] ?? operator;
        }

        // ✅ Booleany
        else if (
            type === 'string' &&
            (value === 'true' || value === 'false' || value === true || value === false)
        ) {
            type = 'boolean';
            value = value === 'true' || value === true;
            operator = 'in';
        }

        // 🔗 Reference
        else if (operator === 'in') {
            type = 'reference'; // alebo 'entity', ak to chceš mať presne ako pri uložení

            if (typeof value === 'string') {
                // ak backend vráti viac ID oddelených ';'
                value = value.includes(';') ? value.split(';') : [value];
            }

            // eq mapujeme na equals, in nechávame tak
            if (operator === 'eq') operator = 'equals';
        }

        return { operator, type, value, negation: negation ?? false };
    };

    // načítanie uloženého filtra
    const loadFilter = (id: string) => {
        const filter = operationsStore.savedFilters.find((f: any) => f.id === id);
        if (!filter) return;

        filters.value = {};

        for (const [col, def] of Object.entries(filter.parameters)) {
            if (col === 'operationDefinition') continue;

            let { operator, type, value } = def as any;

            // 🗓️ BETWEEN (date/number)
            if (operator === 'between' && typeof value === 'string' && value.includes(';')) {
                const [fromRaw, toRaw] = value.split(';');

                const from =
                    type === 'date' && fromRaw
                        ? new Date(fromRaw)
                        : fromRaw
                          ? Number(fromRaw)
                          : null;
                const to =
                    type === 'date' && toRaw ? new Date(toRaw) : toRaw ? Number(toRaw) : null;

                filters.value[col] = {
                    operator: 'between',
                    value: { from, to }
                };
                continue;
            }

            // 🗓️ DATE (absolútny aj relatívny)
            if (type === 'date' && typeof value === 'string') {
                if (operator === 'dateIs') operator = 'equals';

                const relativeDateRegex = /^-?\d+(d|w|m|y)$|^(1(bom|lom|bow|low|boy|loy))$/;
                const relativeRangeRegex = /^([^\s>]+)>([^\s<]+)$/;

                if (relativeRangeRegex.test(value)) {
                    filters.value[col] = {
                        operator,
                        value
                    };
                } else if (relativeDateRegex.test(value)) {
                    filters.value[col] = {
                        operator,
                        value
                    };
                } else {
                    filters.value[col] = {
                        operator,
                        value: new Date(value)
                    };
                }

                continue;
            }

            // 🔢 NUMBER
            if (type === 'number' && (typeof value === 'string' || typeof value === 'number')) {
                const numericValue = Number(value) / 100;
                filters.value[col] = {
                    operator: operator === 'eq' ? 'equals' : operator,
                    value: numericValue
                };
                continue;
            }

            // ✅ BOOLEAN
            if (type === 'boolean') {
                const boolVal = value === true || value === 'true';
                filters.value[col] = {
                    operator: 'in',
                    value: boolVal
                };
                continue;
            }

            // 🔗 REFERENCE
            if (type === 'entity' || type === 'reference') {
                const values =
                    typeof value === 'string'
                        ? value.split(';')
                        : Array.isArray(value)
                          ? value
                          : [];
                filters.value[col] = {
                    operator: operator === 'eq' ? 'equals' : operator,
                    value: values
                };
                continue;
            }

            // 📄 STRING (fallback)
            filters.value[col] = {
                operator,
                value
            };
        }

        applyFilter();
    };

    // synchronizácia buffera pre string input
    watch(localValue, (val) => {
        if (activeColumn.value) {
            filters.value[activeColumn.value.name].value = val;
        }
    });

    // vymazanie všetkých filtrov
    const clearAllFilters = () => {
        for (const key of Object.keys(filters.value)) {
            const filter = filters.value[key];

            if (!filter) continue;

            filter.operator = '';

            if (
                typeof filter.value === 'object' &&
                filter.value !== null &&
                'from' in filter.value &&
                'to' in filter.value
            ) {
                // between
                filter.value = { from: null, to: null };
            } else {
                filter.value = '';
            }
        }

        // vyresetuj buffer pre stringy
        localValue.value = '';

        // vyresetuj vybraný uložený filter
        selectedFilter.value = null;

        // refresh tabuľky
        applyFilter();
        showClearAll.value = false;
    };

    // či je filter aktívny
    const isFilterActive = (colName: string): boolean => {
        const filter = filters.value[colName];
        if (!filter) return false;

        if (!filter.operator) return false;

        if (filter.operator === 'between' && filter.value) {
            return !!(filter.value.from || filter.value.to);
        }

        return filter.value !== '' && filter.value !== null && filter.value !== undefined;
    };

    return {
        filterPopup,
        activeColumn,
        filters,
        localValue,
        selectedOperator,
        filterValue,
        showClearAll,
        selectedFilter,
        newFilterName,
        operators,
        referenceOptions,
        openFilter,
        applyFilter,
        clearFilter,
        saveFilter,
        deleteFilter,
        normalizeFilterDef,
        loadFilter,
        clearAllFilters,
        isFilterActive
    };
}
