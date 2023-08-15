<script setup>
import ProductCard from '../components/ProductCard.vue';
import { useProductStore } from '../stores/product';

const { products } = useProductStore(); 

</script>

<template>
    <h1 class="font-bold text-2xl mb-4">Here's our products</h1>
    <div class="grid grid-cols-3 gap-4" v-if="products.length">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
</template>