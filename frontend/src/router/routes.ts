import LoginPage from '@/views/LoginPage.vue';
import { ROUTE_NAMES } from '@/router/names';
import type { RouteRecordRaw } from 'vue-router';

const modules = import.meta.glob('/src/views/**/*.vue');

const loadView = (view: string, folder?: string) => {
    const path = folder ? `/src/views/${folder}/${view}.vue` : `/src/views/${view}.vue`;
    const loader = modules[path];
    if (!loader) throw new Error(`View not found: ${path}`);
    return loader;
};

// ===== Route groups =====
const cashFlowRoutes: RouteRecordRaw[] = [
    {
        path: 'cash-flow/definitions',
        name: ROUTE_NAMES.cashFlowDefinitionsPage,
        component: loadView('CashFlowDefinitionsPage', 'cash-flow')
    },
    {
        path: 'cash-flow/cash-events',
        name: ROUTE_NAMES.cashFlowCashEventsPage,
        component: loadView('CashFlowEventsPage', 'cash-flow')
    },
    {
        path: 'cash-flow/cash-effects',
        name: ROUTE_NAMES.cashFlowCashEffectsPage,
        component: loadView('CashFlowEffectsPage', 'cash-flow')
    }
];

const reportingRoutes: RouteRecordRaw[] = [
    {
        path: 'reporting/definitions',
        name: ROUTE_NAMES.reportsPage,
        component: loadView('ReportsPage', 'reports')
    }
];

const operationRoutes: RouteRecordRaw[] = [
    {
        path: '/operations/:id',
        name: ROUTE_NAMES.definitionPage,
        component: loadView('DefinitionDetailPage', 'operations')
    },
    {
        path: '/operations/:id/new',
        name: ROUTE_NAMES.newOperationPage,
        component: loadView('NewOperationPage', 'operations')
    },
    {
        path: '/operations/:definitionId/edit/:operationId',
        name: ROUTE_NAMES.operationEditPage,
        component: loadView('OperationEditPage', 'operations')
    },
    {
        path: '/operations/:definitionId/copy/:operationId',
        name: ROUTE_NAMES.copyOperationPage,
        component: loadView('OperationCopyPage', 'operations')
    }
];

const partiesRoutes: RouteRecordRaw[] = [
    {
        path: 'parties',
        name: ROUTE_NAMES.counterpartiesPage,
        component: loadView('PartiesPage', 'parties')
    },
    {
        path: 'parties/credit-risk',
        name: ROUTE_NAMES.creditRiskPage,
        component: loadView('CreditRiskPage', 'parties')
    }
];

const bankingRoutes: RouteRecordRaw[] = [
    {
        path: 'banking/accounts',
        name: ROUTE_NAMES.accountsPage,
        component: loadView('AccountsListPage', 'banking')
    },
    {
        path: 'banking/account-balances',
        name: ROUTE_NAMES.accountBalancesPage,
        component: loadView('AccountBalancePage', 'banking')
    },
    {
        path: 'banking/account-balance-items',
        name: ROUTE_NAMES.accountBalanceItemsPage,
        component: loadView('AccountBalanceItemsPage', 'banking')
    },
    {
        path: 'banking/account-balances-blotter',
        name: ROUTE_NAMES.accountBalancesBlotterPage,
        component: loadView('AccountBalancesBlotterPage', 'banking')
    },
    {
        path: 'banking/account-timelines',
        name: ROUTE_NAMES.accountTimelinesPage,
        component: loadView('AccountTimelinesPage', 'banking')
    },
    {
        path: 'banking/reconciliation-items',
        name: ROUTE_NAMES.reconciliationItemsPage,
        component: loadView('ReconciliationItemsPage', 'banking')
    },
    {
        path: 'banking/reconciliation-workbench',
        name: ROUTE_NAMES.reconciliationWorkbenchPage,
        component: loadView('ReconciliationWorkbenchPage', 'banking')
    }
];

const marketRoutes: RouteRecordRaw[] = [
    {
        path: 'market/currencies',
        name: ROUTE_NAMES.currenciesPage,
        component: loadView('CurrenciesPage', 'market')
    },
    {
        path: 'market/exchange-rates',
        name: ROUTE_NAMES.exchangeRatesPage,
        component: loadView('ExchangeRatesPage', 'market')
    },
    {
        path: 'market/interest-rates',
        name: ROUTE_NAMES.interestRatesPage,
        component: loadView('InterestRatesPage', 'market')
    },
    {
        path: 'market/volatilities',
        name: ROUTE_NAMES.volatilitiesPage,
        component: loadView('VolatilitiesPage', 'market')
    }
];

const processingRoutes: RouteRecordRaw[] = [
    {
        path: 'processing/processes',
        name: ROUTE_NAMES.processesPage,
        component: loadView('ProcessesPage', 'processing')
    },
    {
        path: 'processing/files',
        name: ROUTE_NAMES.filesPage,
        component: loadView('FilesPage', 'processing')
    },
    {
        path: 'processing/mappings',
        name: ROUTE_NAMES.mappingsPage,
        component: loadView('MappingsPage', 'processing')
    },
    {
        path: 'processing/scheduled-jobs',
        name: ROUTE_NAMES.scheduledJobsPage,
        component: loadView('ScheduledJobsPage', 'processing')
    },
    {
        path: 'processing/definitions',
        name: ROUTE_NAMES.definitionsPage,
        component: loadView('DefinitionsPage', 'processing')
    }
];

const administrationRoutes: RouteRecordRaw[] = [
    {
        path: 'administration/operation-definitions',
        name: ROUTE_NAMES.operationDefinitionsPage,
        component: loadView('OperationDefinitionsPage', 'administration')
    },
    {
        path: 'administration/operation-definition-groups',
        name: ROUTE_NAMES.operationDefinitionGroupsPage,
        component: loadView('OperationDefinitionGroupsPage', 'administration')
    },
    {
        path: 'administration/operation-link-definitions',
        name: ROUTE_NAMES.operationLinkDefinitionsPage,
        component: loadView('OperationLinkDefinitionsPage', 'administration')
    },
    {
        path: 'administration/cash-event-generation-scripts',
        name: ROUTE_NAMES.cashEventGenerationScriptsPage,
        component: loadView('CashEventGenerationScriptsPage', 'administration')
    },
    {
        path: 'administration/operation-links',
        name: ROUTE_NAMES.operationLinksPage,
        component: loadView('OperationLinksPage', 'administration')
    },
    {
        path: 'administration/users',
        name: ROUTE_NAMES.usersPage,
        component: loadView('UsersPage', 'administration')
    },
    {
        path: 'administration/users/:id',
        name: ROUTE_NAMES.usersSettingsPage,
        component: loadView('UsersSettingsPage', 'administration')
    },
    {
        path: 'administration/security-groups',
        name: ROUTE_NAMES.securityGroupsPage,
        component: loadView('SecurityGroupsPage', 'administration')
    }
];

// ===== Routes root =====
export const routes: RouteRecordRaw[] = [
    { path: '/', name: ROUTE_NAMES.loginPage, component: LoginPage },
    {
        path: '/ot',
        name: ROUTE_NAMES.otPage,
        meta: { requiresAuth: true },
        component: loadView('MainLayoutPage'),
        children: [
            {
                path: 'dashboard',
                name: ROUTE_NAMES.dashboardPage,
                component: loadView('DashboardPage', 'dashboard')
            },
            ...cashFlowRoutes,
            ...reportingRoutes,
            ...partiesRoutes,
            ...bankingRoutes,
            ...marketRoutes,
            ...processingRoutes,
            ...administrationRoutes,
            ...operationRoutes
        ]
    }
];

export default routes;
