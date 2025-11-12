import type { TableColumn } from '@/types/generic-data-table/definition-types';
import type { OpenTreasuryAccount } from '@opentreasury/opentreasury-service-api';

export const TABLE_DEFINITION: Array<TableColumn<OpenTreasuryAccount>> = [
    { name: 'name', label: 'Název', value: (data) => data.name },
    { name: 'alias', label: 'Alias', value: (data) => data.alias ?? '' },
    { name: 'accountNumber', label: 'Číslo účtu', value: (data) => data.accountNumber ?? '' },
    {
        name: 'eBankingAccountNumber',
        label: 'eBanking účet',
        value: (data) => data.eBankingAccountNumber ?? ''
    },
    { name: 'iban', label: 'IBAN', value: (data) => data.iban ?? '' },
    { name: 'bankId', label: 'Kód banky', value: (data) => data.bankId ?? '' },
    { name: 'currency', label: 'Měna', value: (data) => data.currency ?? '' },
    { name: 'type', label: 'Typ', value: (data) => data.type ?? '' },
    { name: 'active', label: 'Aktivní', value: (data) => (data.active ? 'Ano' : 'Ne') },
    { name: 'activeFrom', label: 'Platné od', value: (data) => data.activeFrom ?? '' },
    { name: 'activeThru', label: 'Platné do', value: (data) => data.activeThru ?? '' },
    {
        name: 'overdraftLimit',
        label: 'Povolený debet',
        value: (data) => (data.overdraftLimit != null ? data.overdraftLimit.toString() : '')
    },
    { name: 'geoPoint', label: 'Geo bod', value: (data) => data.geoPoint ?? '' },
    { name: 'internal', label: 'Interní', value: (data) => (data.internal ? 'Ano' : 'Ne') },
    { name: 'vizColor', label: 'Barva', value: (data) => data.vizColor ?? '' },
    {
        name: 'securityGroup',
        label: 'Bezpečnostní skupina',
        value: (data) => data.securityGroup ?? ''
    }
];
