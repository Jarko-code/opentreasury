<template>
    <div class="text-xl mb-3">{{ t('userSettings.header') }}</div>

    <Accordion :value="['0', '1']" multiple>
        <AccordionPanel value="0">
            <AccordionHeader> {{ t('userSettings.formatting') }} </AccordionHeader>
            <AccordionContent>
                <div class="grid gap-y-4">
                    <div
                        class="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-2 md:gap-x-4"
                    >
                        <label class="font-medium md:text-right">
                            {{ t('userSettings.preferences') }}
                        </label>
                        <InputText type="text" v-model="preferences.id" disabled class="w-full" />
                    </div>

                    <div
                        class="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-2 md:gap-x-4"
                    >
                        <label class="font-medium md:text-right">
                            {{ t('userSettings.defaultNumberSeparator') }}
                        </label>
                        <InputText
                            type="text"
                            v-model="preferences.defaultNumberSeparator"
                            class="w-full"
                        />
                    </div>

                    <div
                        class="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-2 md:gap-x-4"
                    >
                        <label class="font-medium md:text-right">
                            {{ t('userSettings.defaultThousandSeparator') }}
                        </label>
                        <InputText
                            type="text"
                            v-model="preferences.defaultThousandSeparator"
                            class="w-full"
                        />
                    </div>
                </div>
            </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="1">
            <AccordionHeader>{{ t('userSettings.decimals') }}</AccordionHeader>
            <AccordionContent>
                <div class="grid gap-y-4">
                    <div
                        class="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-2 md:gap-x-4"
                    >
                        <label class="font-medium md:text-right">
                            {{ t('userSettings.defaultDecimalPlaces') }}
                        </label>
                        <InputText
                            type="text"
                            v-model="preferences.defaultDecimalPlaces"
                            class="w-full"
                        />
                    </div>

                    <div
                        class="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-2 md:gap-x-4"
                    >
                        <label class="font-medium md:text-right">
                            {{ t('userSettings.cashFlowDecimalPlaces') }}
                        </label>
                        <InputText
                            type="text"
                            v-model="preferences.cashFlowDecimalPlaces"
                            class="w-full"
                        />
                    </div>
                </div>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>

    <div class="text-right mt-4">
        <Button
            :label="t('userSettings.save')"
            severity="danger"
            @click="updatePreferences"
            class="w-full sm:w-auto"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user-store';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useAlert } from '@/composables/useAlert';

const { t } = useI18n();
const route = useRoute();
const userStore = useUserStore();
const { preferences } = storeToRefs(userStore);
const { success, error } = useAlert();

onMounted(async () => {
    await userStore.fetchPreferences();
});

const updatePreferences = async () => {
    try {
        await userStore.updatePreferences();
        success(t('userSettings.success'), t('userSettings.successMessage'));
    } catch (err) {
        console.error('Error saving preferences:', err);
        error(t('userSettings.error'), t('userSettings.errorMessage'));
    }
};
</script>
