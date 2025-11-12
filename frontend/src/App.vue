<template>
    <toast />
    <ConfirmDialog />
    <RouterView />
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { ROUTE_NAMES } from '@/router/names';

// Constants and variables
const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

// Helper function to update document title
const updateDocumentTitle = () => {
    const title: string = 'OT';
    const titles: Record<string, string> = {
        [ROUTE_NAMES.loginPage]: `${title} | ${t('documentTitle.loginPage')}`,
        [ROUTE_NAMES.otPage]: `${title} | ${t('documentTitle.otPage')}`,
        [ROUTE_NAMES.dashboardPage]: `${title} | ${t('documentTitle.dashboardPage')}`,

        // cash flow
        [ROUTE_NAMES.cashFlowDefinitionsPage]: `${title} | ${t('documentTitle.cashFlowDefinitionsPage')}`,
        [ROUTE_NAMES.cashFlowCashEventsPage]: `${title} | ${t('documentTitle.cashFlowCashEventsPage')}`,
        [ROUTE_NAMES.cashFlowCashEffectsPage]: `${title} | ${t('documentTitle.cashFlowCashEffectsPage')}`,

        // reports
        [ROUTE_NAMES.reportsPage]: `${title} | ${t('documentTitle.reportsPage')}`,

        // operations
        [ROUTE_NAMES.definitionPage]: `${title} | ${t('documentTitle.definitionPage')}`,

        // counterparties
        [ROUTE_NAMES.counterpartiesPage]: `${title} | ${t('documentTitle.counterpartiesPage')}`,
        [ROUTE_NAMES.creditRiskPage]: `${title} | ${t('documentTitle.creditRiskPage')}`,

        // accounts
        [ROUTE_NAMES.accountsPage]: `${title} | ${t('documentTitle.accountsPage')}`,
        [ROUTE_NAMES.accountBalancesPage]: `${title} | ${t('documentTitle.accountBalancesPage')}`,
        [ROUTE_NAMES.accountBalanceItemsPage]: `${title} | ${t('documentTitle.accountBalanceItemsPage')}`,
        [ROUTE_NAMES.accountBalancesBlotterPage]: `${title} | ${t('documentTitle.accountBalancesBlotterPage')}`,
        [ROUTE_NAMES.accountTimelinesPage]: `${title} | ${t('documentTitle.accountTimelinesPage')}`,
        [ROUTE_NAMES.reconciliationItemsPage]: `${title} | ${t('documentTitle.reconciliationItemsPage')}`,
        [ROUTE_NAMES.reconciliationWorkbenchPage]: `${title} | ${t('documentTitle.reconciliationWorkbenchPage')}`,

        // market data
        [ROUTE_NAMES.currenciesPage]: `${title} | ${t('documentTitle.currenciesPage')}`,
        [ROUTE_NAMES.exchangeRatesPage]: `${title} | ${t('documentTitle.exchangeRatesPage')}`,
        [ROUTE_NAMES.interestRatesPage]: `${title} | ${t('documentTitle.interestRatesPage')}`,
        [ROUTE_NAMES.volatilitiesPage]: `${title} | ${t('documentTitle.volatilitiesPage')}`,

        // processing
        [ROUTE_NAMES.processesPage]: `${title} | ${t('documentTitle.processesPage')}`,
        [ROUTE_NAMES.filesPage]: `${title} | ${t('documentTitle.filesPage')}`,
        [ROUTE_NAMES.mappingsPage]: `${title} | ${t('documentTitle.mappingsPage')}`,
        [ROUTE_NAMES.scheduledJobsPage]: `${title} | ${t('documentTitle.scheduledJobsPage')}`,
        [ROUTE_NAMES.definitionsPage]: `${title} | ${t('documentTitle.definitionsPage')}`,

        // administration
        [ROUTE_NAMES.operationDefinitionsPage]: `${title} | ${t('documentTitle.operationDefinitionsPage')}`,
        [ROUTE_NAMES.operationDefinitionGroupsPage]: `${title} | ${t('documentTitle.operationDefinitionGroupsPage')}`,
        [ROUTE_NAMES.operationLinkDefinitionsPage]: `${title} | ${t('documentTitle.operationLinkDefinitionsPage')}`,
        [ROUTE_NAMES.cashEventGenerationScriptsPage]: `${title} | ${t('documentTitle.cashEventGenerationScriptsPage')}`,
        [ROUTE_NAMES.operationLinksPage]: `${title} | ${t('documentTitle.operationLinksPage')}`,
        [ROUTE_NAMES.usersPage]: `${title} | ${t('documentTitle.usersPage')}`,
        [ROUTE_NAMES.usersSettingsPage]: `${title} | ${t('documentTitle.usersSettingsPage')}`,
        [ROUTE_NAMES.securityGroupsPage]: `${title} | ${t('documentTitle.securityGroupsPage')}`
    };

    const name = route.name as string | undefined;
    if (name && titles[name]) {
        document.title = titles[name];
    }
};

// Watch for changes in locale or route and update the title
watch(
    [locale, route],
    async () => {
        await router.isReady();
        updateDocumentTitle();
    },
    { immediate: true, deep: true }
);
</script>
