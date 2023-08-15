<script setup>
import { useRoute } from 'vue-router';
import { useProductStore } from '../stores/product';
import { computed } from 'vue';
import useFormatCurrency from '../composables/useFormatCurrency';
import { useCartStore } from '../stores/cart';

const formatCurrency = useFormatCurrency();
const { params } = useRoute();
const { products } = useProductStore();
const { addToCart } = useCartStore();

const product = computed(() => products.find(product => product.slug === params.slug))
</script>

<template>
    <div class="mt-16 flex gap-4">
        <img class="rounded-lg" src="https://placehold.co/600x600"/>
        <div class="px-4 py-16 space-y-4">
            <h1 class="font-bold text-4xl">{{ product.name }}</h1>
            <p class="text-neutral-700 text-base">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur est laudantium velit ea animi enim explicabo neque nostrum quod modi ducimus sit officia, fugit odio fuga, nobis sint dolorem optio! Eligendi possimus temporibus eum eius aperiam, ipsam impedit optio officiis deleniti. Minima ipsum repudiandae minus amet officiis iusto labore pariatur.
            </p>
            <div class="flex space-x-4 items-center">
                <button @click="() => addToCart(product)" class="bg-pink-500 hover:bg-pink-600 rounded-lg px-4 py-2 text-white">Add to cart</button>
                <p class="font-semibold" v-text="formatCurrency(product.price)"></p>
            </div>
        </div>
    </div>
</template>