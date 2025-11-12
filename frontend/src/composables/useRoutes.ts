import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ROUTE_NAMES } from '@/router/names';
import { useDefinitionsStore } from '@/stores/useDefinitionsStore';

export const useRoutes = () => {
    const { t } = useI18n({ useScope: 'global' });
    const definitionStore = useDefinitionsStore();

    const ICONS = [
        'pi pi-briefcase',
        'pi pi-chart-bar',
        'pi pi-dollar',
        'pi pi-calendar',
        'pi pi-cog',
        'pi pi-users',
        'pi pi-database',
        'pi pi-wallet',
        'pi pi-bolt',
        'pi pi-percentage'
    ];

    // helper na výber random ikony
    const getRandomIcon = () => {
        const index = Math.floor(Math.random() * ICONS.length);
        return ICONS[index];
    };

    onMounted(() => {
        // načítaj operácie len keď ešte nie sú
        if (!definitionStore.definitions.length) {
            definitionStore.fetchAllDefinitions();
        }
    });

    const NAVIGATION = computed(() => [
        // dashboards
        {
            label: t('documentTitle.dashboardPage'),
            icon: 'pi pi-home',
            items: [
                {
                    label: t('documentTitle.dashboardPage'),
                    icon: 'pi pi-home',
                    route: { name: ROUTE_NAMES.dashboardPage }
                }
            ]
        },
        // cash flow
        // {
        //     label: t('navigation.cashFlow.cashFlow'),
        //     icon: 'pi pi-wallet',
        //     items: [
        //         {
        //             label: t('navigation.cashFlow.reports.reports'),
        //             icon: 'pi pi-chart-bar'
        //         },
        //         {
        //             label: t('navigation.cashFlow.settings.settings'),
        //             icon: 'pi pi-cog',
        //             items: [
        //                 {
        //                     label: t('navigation.cashFlow.settings.definitions'),
        //                     icon: 'pi pi-sliders-h',
        //                     route: { name: ROUTE_NAMES.cashFlowDefinitionsPage }
        //                 }
        //             ]
        //         },
        //         {
        //             label: t('navigation.cashFlow.events.events'),
        //             icon: 'pi pi-bolt',
        //             items: [
        //                 {
        //                     label: t('navigation.cashFlow.events.cashEvents'),
        //                     icon: 'pi pi-money-bill',
        //                     route: { name: ROUTE_NAMES.cashFlowCashEventsPage }
        //                 },
        //                 {
        //                     label: t('navigation.cashFlow.events.effects'),
        //                     icon: 'pi pi-bolt',
        //                     route: { name: ROUTE_NAMES.cashFlowCashEffectsPage }
        //                 }
        //             ]
        //         }
        //     ]
        // },
        // reports
        // {
        //     label: t('navigation.reports.reports'),
        //     icon: 'pi pi-chart-pie',
        //     items: [
        //         {
        //             label: t('navigation.reports.var.var'),
        //             icon: 'pi pi-percentage',
        //             items: [
        //                 {
        //                     label: t('navigation.reports.var.var'),
        //                     icon: 'pi pi-percentage',
        //                     route: { name: ROUTE_NAMES.reportsPage }
        //                 }
        //             ]
        //         },
        //         { label: t('navigation.reports.comparison'), icon: 'pi pi-sliders-h' }
        //     ]
        // },
        // operations
        {
            label: t('navigation.operations.operations'),
            icon: 'pi pi-briefcase',
            items: definitionStore.definitions.map((op) => ({
                label: op.name as string,
                // icon: getRandomIcon(),
                route: { name: ROUTE_NAMES.definitionPage, params: { id: op.id } }
            }))
        },
        // counterparties
        // {
        //     label: t('navigation.counterparties.counterparties'),
        //     icon: 'pi pi-users',
        //     items: [
        //         {
        //             label: t('navigation.counterparties.counterparties'),
        //             icon: 'pi pi-user',
        //             items: [
        //                 {
        //                     label: t('navigation.counterparties.list'),
        //                     icon: 'pi pi-list',
        //                     route: { name: ROUTE_NAMES.counterpartiesPage }
        //                 }
        //             ]
        //         },
        //         {
        //             label: t('navigation.counterparties.creditRisk'),
        //             icon: 'pi pi-shield',
        //             items: [
        //                 {
        //                     label: t('navigation.counterparties.creditRiskManagement'),
        //                     icon: 'pi pi-lock',
        //                     route: { name: ROUTE_NAMES.creditRiskPage }
        //                 }
        //             ]
        //         }
        //     ]
        // },
        //accounts
        {
            label: t('navigation.accounts.accounts'),
            icon: 'pi pi-credit-card',
            items: [
                {
                    label: t('navigation.accounts.accounts'),
                    icon: 'pi pi-credit-card',
                    items: [
                        {
                            label: t('navigation.accounts.list'),
                            icon: 'pi pi-list',
                            route: { name: ROUTE_NAMES.accountsPage }
                        }
                    ]
                },
                {
                    label: t('navigation.accounts.bankBalance.bankBalance'),
                    icon: 'pi pi-dollar',
                    items: [
                        {
                            label: t('navigation.accounts.bankBalance.list'),
                            icon: 'pi pi-list',
                            route: { name: ROUTE_NAMES.accountBalancesPage }
                        },
                        {
                            label: t('navigation.accounts.bankBalance.list2'),
                            icon: 'pi pi-list',
                            route: { name: ROUTE_NAMES.accountBalanceItemsPage }
                        },
                        {
                            label: t('navigation.accounts.bankBalance.manualBalances'),
                            icon: 'pi pi-pencil',
                            route: { name: ROUTE_NAMES.accountBalancesBlotterPage }
                        },
                        {
                            label: t('navigation.accounts.bankBalance.balancesTimeline'),
                            icon: 'pi pi-calendar',
                            route: { name: ROUTE_NAMES.accountTimelinesPage }
                        }
                    ]
                },
                {
                    label: t('navigation.accounts.reconciliation.reconciliation'),
                    icon: 'pi pi-check',
                    items: [
                        {
                            label: t('navigation.accounts.reconciliation.reconciliationItems'),
                            icon: 'pi pi-check-square',
                            route: { name: ROUTE_NAMES.reconciliationItemsPage }
                        },
                        {
                            label: t('navigation.accounts.reconciliation.manuallyReconciliation'),
                            icon: 'pi pi-pencil',
                            route: { name: ROUTE_NAMES.reconciliationWorkbenchPage }
                        }
                    ]
                }
            ]
        },
        // market data
        // {
        //     label: t('navigation.markerData.markerData'),
        //     icon: 'pi pi-chart-line',
        //     items: [
        //         {
        //             label: t('navigation.markerData.currency'),
        //             icon: 'pi pi-dollar',
        //             items: [
        //                 {
        //                     label: t('navigation.markerData.list'),
        //                     icon: 'pi pi-list',
        //                     route: { name: ROUTE_NAMES.currenciesPage }
        //                 }
        //             ]
        //         },
        //         {
        //             label: t('navigation.markerData.markerData'),
        //             icon: 'pi pi-chart-line',
        //             items: [
        //                 {
        //                     label: t('navigation.markerData.currencyRates'),
        //                     icon: 'pi pi-percentage',
        //                     route: { name: ROUTE_NAMES.exchangeRatesPage }
        //                 },
        //                 {
        //                     label: t('navigation.markerData.interestRates'),
        //                     icon: 'pi pi-percentage',
        //                     route: { name: ROUTE_NAMES.interestRatesPage }
        //                 },
        //                 {
        //                     label: t('navigation.markerData.volatility'),
        //                     icon: 'pi pi-wave-pulse',
        //                     route: { name: ROUTE_NAMES.volatilitiesPage }
        //                 }
        //             ]
        //         }
        //     ]
        // },
        // processing
        {
            label: t('navigation.processing.processing'),
            icon: 'pi pi-cog',
            items: [
                {
                    label: t('navigation.processing.process.process'),
                    icon: 'pi pi-cog',
                    items: [
                        {
                            label: t('navigation.processing.process.history'),
                            icon: 'pi pi-history',
                            route: { name: ROUTE_NAMES.processesPage }
                        }
                        // {
                        //     label: t('navigation.processing.process.uploads'),
                        //     icon: 'pi pi-upload',
                        //     route: { name: ROUTE_NAMES.filesPage }
                        // },
                        // {
                        //     label: t('navigation.processing.process.maping'),
                        //     icon: 'pi pi-map',
                        //     route: { name: ROUTE_NAMES.mappingsPage }
                        // }
                    ]
                },
                // {
                //     label: t('navigation.processing.planning.planning'),
                //     icon: 'pi pi-calendar',
                //     items: [
                //         {
                //             label: t('navigation.processing.planning.scheduledTasks'),
                //             icon: 'pi pi-clock',
                //             route: { name: ROUTE_NAMES.scheduledJobsPage }
                //         }
                //     ]
                // },
                {
                    label: t('navigation.processing.scripting.scripting'),
                    icon: 'pi pi-code',
                    items: [
                        {
                            label: t('navigation.processing.scripting.scripts'),
                            icon: 'pi pi-file',
                            route: { name: ROUTE_NAMES.definitionsPage }
                        }
                    ]
                }
            ]
        }
        // administration
        // {
        //     label: t('navigation.administration.administration'),
        //     icon: 'pi pi-lock',
        //     items: [
        //         {
        //             label: t('navigation.administration.operation.operation'),
        //             icon: 'pi pi-cog',
        //             items: [
        //                 {
        //                     label: t('navigation.administration.operation.operationDef'),
        //                     icon: 'pi pi-sliders-h',
        //                     route: { name: ROUTE_NAMES.operationDefinitionsPage }
        //                 },
        //                 {
        //                     label: t('navigation.administration.operation.operationCategory'),
        //                     icon: 'pi pi-tags',
        //                     route: { name: ROUTE_NAMES.operationDefinitionGroupsPage }
        //                 },
        //                 {
        //                     label: t('navigation.administration.operation.defBetweenOperation'),
        //                     icon: 'pi pi-sync',
        //                     route: { name: ROUTE_NAMES.operationLinkDefinitionsPage }
        //                 },
        //                 {
        //                     label: t('navigation.administration.operation.cashEventScripts'),
        //                     icon: 'pi pi-code',
        //                     route: { name: ROUTE_NAMES.cashEventGenerationScriptsPage }
        //                 },
        //                 {
        //                     label: t('navigation.administration.operation.linksBetweenOperation'),
        //                     icon: 'pi pi-link',
        //                     route: { name: ROUTE_NAMES.operationLinksPage }
        //                 }
        //             ]
        //         },
        //         {
        //             label: t('navigation.administration.security.security'),
        //             icon: 'pi pi-shield',
        //             items: [
        //                 {
        //                     label: t('navigation.administration.security.users'),
        //                     icon: 'pi pi-user',
        //                     route: { name: ROUTE_NAMES.usersPage }
        //                 },
        //                 {
        //                     label: t('navigation.administration.security.usersGroup'),
        //                     icon: 'pi pi-users',
        //                     route: { name: ROUTE_NAMES.securityGroupsPage }
        //                 }
        //             ]
        //         }
        //     ]
        // }
    ]);

    return { NAVIGATION };
};
