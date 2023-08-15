import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCartStore = defineStore('cart', function () {
    const cart = ref([]);

    const cartItemCount = computed(() => cart.value.length);

    const cartTotalPrice = computed(() => cart.value.reduce((acc, item) => acc + (item.quantity * item.price), 0), {
        onTrack(event) {
            console.log('tracking', event);
        },
        onTrigger(event) {
            console.log('trigger', event)
        }
    });

    function addToCart(product) {
        const productCartIndex = cart.value.findIndex(item => item.slug === product.slug);

        if (productCartIndex !== -1) {
            cart.value[productCartIndex].quantity++;
            return;
        }

        product.quantity = 1;
        cart.value.push(product);
    }

    function clearCart() {
        cart.value = [];
    }

    function removeFromCart(product) {
        cart.value = cart.value.filter(item => item.slug !== product.slug);
    }

    return { cart, cartItemCount, cartTotalPrice, addToCart, removeFromCart, clearCart }; 
}) 