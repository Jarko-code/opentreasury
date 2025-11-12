import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useDefinitionsStore } from '@/stores/useDefinitionsStore';

export const useActiveDefinition = () => {
    const route = useRoute();
    const definitionStore = useDefinitionsStore();
    const { definitions } = storeToRefs(definitionStore);

    const definition = computed(() => {
        // 1 edit/detail stránka - definícia v route param
        if (route.params.definitionId) {
            return definitions.value.find((op) => op.id === route.params.definitionId);
        }

        // 2 starší spôsob (napr. detail podľa :id)
        if (route.params.id) {
            return definitions.value.find((op) => op.id === route.params.id);
        }

        // 3 query param z filtra / redirectu
        if (route.query.definitionId) {
            return definitions.value.find((op) => op.id === route.query.definitionId);
        }

        // 4 fallback: prvá dostupná definícia
        return definitions.value[0] ?? null;
    });

    return { definition };
};
