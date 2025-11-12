<template>
    <div class="text-xl mb-5">{{ title }}</div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    }
});
</script>
