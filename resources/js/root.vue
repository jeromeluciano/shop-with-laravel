<script setup>
import { storeToRefs } from 'pinia';
import { useCartStore } from './stores/cart';
import { useRouter } from 'vue-router';

const router = useRouter();

const cartStore = useCartStore();
// this is important to extract reactive properties from the store
// if u dont use storeToRefs ur properties will not be reactive to change
// it will remain stale even if u change ur store state 
const { cartItemCount } = storeToRefs(cartStore);

</script>

<template>
    <div>
        <div class="bg-neutral-800 mb-4">
            <header class="max-w-6xl mx-auto flex items-center justify-between py-4 ">
                <h1 class="text-pink-100 text-lg font-bold">Larashop</h1>
                <button @click="router.push({ name: 'product.checkout' })" class="bg-pink-500 text-white py-2 px-4 rounded-lg">
                    Checkout 
                    <span v-if="cartItemCount" v-text="cartItemCount"></span>
                </button>
            </header>
        </div>
        <div class="max-w-6xl mx-auto">
            <RouterView></RouterView>
        </div>
    </div>
</template>