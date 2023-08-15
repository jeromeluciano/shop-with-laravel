import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

export const useOrderStore = defineStore('orders',() => {
    const state = reactive({
        order: {}
    });

    function updateStore(order) {
        state.order = {...order}
    }

    const orderQuantity = computed(() => state.order.products.reduce((acc, item) => acc + item.pivot.quantity, 0));

    const totalPriceOrder = computed(() => state.order.products.reduce((acc, item) => acc + (item.price * item.pivot.quantity), 0));

    return { state, updateStore, totalPriceOrder, orderQuantity };
});