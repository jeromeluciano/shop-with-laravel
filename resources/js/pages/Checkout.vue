<script setup>
import { storeToRefs } from 'pinia';
import { useCartStore } from '../stores/cart';
import { useOrderStore } from '../stores/order';
import useFormatCurrency from '../composables/useFormatCurrency';
import { ref, reactive, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const formatCurrency = useFormatCurrency();
const cartStore = useCartStore();
const { cart, cartTotalPrice } = storeToRefs(cartStore);

const orderStore = useOrderStore();

const paymentProcessing = ref(false);

const card = reactive({
    element: null
});

const stripe = reactive({
    api: null
});

const customer = reactive({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
});

onMounted(async () => {
    stripe.api = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

    const elements = stripe.api.elements();

    card.element = elements.create('card', {
        classes: {
            base: 'bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 p-3 leading-8 transition-colors duration-200 ease-in-out'
        },
    });

    card.element.mount('#card-element')
})

async function processPayment() {
    paymentProcessing.value = true;
    const { paymentMethod, error } = await stripe.api.createPaymentMethod('card', card.element,
        {
            billing_details: {
                name: `${customer.first_name} ${customer.last_name}`,
                email: customer.email,
                address: {
                    line1: customer.address,
                    city: customer.city,
                    state: customer.state,
                    postal_code: customer.zip_code
                }
            }
        });

    if (error) {
        paymentProcessing.value = false;
    } else {
        customer.payment_method_id = paymentMethod.id;
        customer.amount = cartTotalPrice;
        customer.cart = JSON.stringify(cart.value);

        axios.post('/api/purchase', customer)
            .then(r => {
                paymentProcessing.value = false;
                console.log(r.data);

                orderStore.updateStore(r.data);
                cartStore.clearCart();

                router.push({ name: 'order.summary' })
            })
            .catch(error => {
                paymentProcessing.value = false;
            })
    }
}

</script>

<template>
    <h1 class="text-2xl font-bold">Cart</h1>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg overflow-hidden mt-4">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Quantity
                </th>
                <th scope="col" class="px-6 py-3">
                    Price
                </th>
                <th scope="col" class="px-6 py-3">
                    Actions
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in cart"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {{ item.name }}
                </th>
                <td class="px-6 py-4">
                    {{ item.quantity }}
                </td>
                <td class="px-6 py-4">
                    {{ formatCurrency(item.price) }}
                </td>
                <td class="px-6 py-4">
                    <button @click="() => cartStore.removeFromCart(item)"
                        class="bg-red-600 text-white px-2 py-1 rounded-sm text-xs">Remove</button>
                </td>
            </tr>
            <tr
                class="w-full bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td colspan="4" class="text-white w-full px-6 py-4">
                    <span class="font-bold">Total: </span>
                    <span> {{ formatCurrency(cartTotalPrice) }}</span>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="lg:w-2/3 w-full mx-auto mt-8">
        <div class="flex flex-wrap -mx-2 mt-8">
            <div class="p-2 w-1/3">
                <div class="relative">
                    <label for="first_name" class="leading-7 text-sm text-gray-600">First Name</label>
                    <input type="text" id="first_name" name="first_name"
                        class="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        v-model="customer.first_name" :disabled="paymentProcessing">
                </div>
            </div>
            <div class="p-2 w-1/3">
                <div class="relative">
                    <label for="last_name" class="leading-7 text-sm text-gray-600">Last Name</label>
                    <input type="text" id="last_name" name="last_name"
                        class="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        v-model="customer.last_name" :disabled="paymentProcessing">
                </div>
            </div>
            <div class="p-2 w-1/3">
                <div class="relative">
                    <label for="email" class="leading-7 text-sm text-gray-600">Email Address</label>
                    <input type="email" id="email" name="email"
                        class="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        v-model="customer.email" :disabled="paymentProcessing">
                </div>
            </div>
        </div>
        <div class="flex flex-wrap -mx-2 mt-4">
            <div class="p-2 w-1/3">
                <div class="relative">
                    <label for="address" class="leading-7 text-sm text-gray-600">Street Address</label>
                    <input type="text" id="address" name="address"
                        class="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        v-model="customer.address" :disabled="paymentProcessing">
                </div>
            </div>
            <div class="p-2 w-1/3">
                <div class="relative">
                    <label for="city" class="leading-7 text-sm text-gray-600">City</label>
                    <input type="text" id="city" name="city"
                        class="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        v-model="customer.city" :disabled="paymentProcessing">
                </div>
            </div>
            <div class="p-2 w-1/6">
                <div class="relative">
                    <label for="state" class="leading-7 text-sm text-gray-600">State</label>
                    <input type="email" id="state" name="state"
                        class="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        v-model="customer.state" :disabled="paymentProcessing">
                </div>
            </div>
            <div class="p-2 w-1/6">
                <div class="relative">
                    <label for="zip_code" class="leading-7 text-sm text-gray-600">Zip Code</label>
                    <input type="email" id="zip_code" name="zip_code"
                        class="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        v-model="customer.zip_code" :disabled="paymentProcessing">
                </div>
            </div>
        </div>
        <div class="flex flex-wrap -mx-2 mt-4">
            <div class="p-2 w-full">
                <div class="relative">
                    <label for="card-element" class="leading-7 text-sm text-gray-600">Credit Card Info</label>
                    <div id="card-element"></div>
                </div>
            </div>
        </div>
        <button @click="processPayment" class="bg-pink-500 text-white px-6 py-2 mt-2 rounded-lg font-bold">Order</button>
    </div>
</template>