export const ROUTE_NAMES = {
    loginPage: '/',
    otPage: 'ot',
    dashboardPage: 'dashboard',

    // cash flow
    cashFlowDefinitionsPage: 'cf-definitions',
    cashFlowCashEventsPage: 'cash-events',
    cashFlowCashEffectsPage: 'cash-effects',

    // reports
    reportsPage: 'definitions',

    // operations
    definitionPage: 'definition',
    operationsPage: 'operations',
    operationEditPage: 'operation-edit',
    newOperationPage: 'new-operation',
    copyOperationPage: 'copy-operation',

    // counterparties
    counterpartiesPage: 'parties',
    creditRiskPage: 'credit-risk',

    // accounts
    accountsPage: 'accounts',
    accountBalancesPage: 'account-balances',
    accountBalanceItemsPage: 'account-balance-items',
    accountBalancesBlotterPage: 'account-balances-blotter',
    accountTimelinesPage: 'account-timelines',
    reconciliationItemsPage: 'reconciliation-items',
    reconciliationWorkbenchPage: 'reconciliation-workbench',

    // market data
    currenciesPage: 'currencies',
    exchangeRatesPage: 'exchange-rates',
    interestRatesPage: 'interest-rates',
    volatilitiesPage: 'volatilities',

    // processing
    processesPage: 'processes',
    filesPage: 'files',
    mappingsPage: 'mappings',
    scheduledJobsPage: 'scheduled-jobs',
    definitionsPage: 'processing-definitions',

    // administration
    operationDefinitionsPage: 'operation-definitions',
    operationDefinitionGroupsPage: 'operation-definition-groups',
    operationLinkDefinitionsPage: 'operation-link-definitions',
    cashEventGenerationScriptsPage: 'cash-event-generation-scripts',
    operationLinksPage: 'operation-links',
    usersPage: 'users',
    usersSettingsPage: 'users-settings',
    securityGroupsPage: 'security-groups'
} as const;

export type RouteKey = keyof typeof ROUTE_NAMES;
export type RouteValue = (typeof ROUTE_NAMES)[RouteKey];
