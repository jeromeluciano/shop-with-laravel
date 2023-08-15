<script setup>
import useFormatCurrency from '../composables/useFormatCurrency';

defineProps({
    product: Object
});



const formatCurrency = useFormatCurrency();
</script>

<template>
    <div @click="$router.push({ name: 'product.show', params: { slug: product.slug }})" class="hover:bg-gray-100 p-1 hover:rounded-lg hover:scale-105 hover:cursor-pointer">
        <img class="rounded-lg w-full" src="https://placehold.co/300x200" />
        <h2 class="font-semibold mt-2 text-sm text-neutral-700">{{ product.name }}</h2>
        <p class="text-sm text-neutral-600" v-text="formatCurrency(product.price)"></p>
    </div>
</template>