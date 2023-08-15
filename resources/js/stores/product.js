import axios from "axios";
import { defineStore } from "pinia";
import { reactive, onMounted } from 'vue';

export const useProductStore = defineStore('products', () => {
  const products = reactive([]); 

  async function getProducts() {
    const response = await axios.get('/api/products');
    products.push(...response.data);
  }

  onMounted(async () => {
    await getProducts();
  })

  return { products, getProducts };
});