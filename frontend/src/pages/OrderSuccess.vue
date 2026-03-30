<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../stores/cart';

const route = useRoute();
const cart = useCartStore();

const orderData = ref<any>(null);
const loading = ref(true);

onMounted(async () => {
  window.scrollTo(0, 0);

  // Clear cart on successful order
  cart.clearCart();

  const orderId = route.query.order_id as string;
  if (orderId) {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        orderData.value = await res.json();
      }
    } catch {
      // Non-critical
    }
  }
  loading.value = false;
});

function formatPrice(cents: number) {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}
</script>

<template>
  <div class="w-full min-h-screen bg-apple-black text-apple-light relative overflow-x-hidden pt-32 pb-16">
    <div class="pointer-events-none absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] mix-blend-overlay z-0"></div>

    <div class="max-w-4xl mx-auto px-6 font-mono font-light relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center">

      <!-- Terminal-style success output -->
      <div class="border border-apple-neon/30 p-12 md:p-16 relative w-full max-w-2xl bg-black/60 backdrop-blur-sm">
        <!-- Corner decorations -->
        <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-apple-neon"></div>
        <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-apple-neon"></div>
        <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-apple-neon"></div>
        <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-apple-neon"></div>

        <div class="text-apple-neon text-xs tracking-[0.4em] mb-8 animate-pulse">
          ✓ ORDER CONFIRMED
        </div>

        <h1 class="text-2xl md:text-4xl text-white font-sans font-light tracking-tight mb-6">
          Order Successful
        </h1>

        <div v-if="loading" class="text-apple-gray text-xs tracking-widest">
          RETRIEVING ORDER DATA...
        </div>

        <div v-else class="space-y-3 text-xs tracking-widest text-apple-gray">
          <div v-if="orderData?.id">
            ORDER ID: <span class="text-apple-neon">#{{ orderData.id }}</span>
          </div>
          <div v-if="orderData?.customerName">
            CUSTOMER: <span class="text-white">{{ orderData.customerName }}</span>
          </div>
          <div v-if="orderData?.customerEmail">
            RECEIPT → <span class="text-white">{{ orderData.customerEmail }}</span>
          </div>
          <div v-if="orderData?.totalAmount">
            AMOUNT: <span class="text-apple-neon">{{ formatPrice(orderData.totalAmount) }}</span>
          </div>
          <div>
            STATUS: <span class="text-apple-neon uppercase">{{ orderData?.status || 'CONFIRMED' }}</span>
          </div>

          <!-- Order items -->
          <div v-if="orderData?.items" class="mt-6 border-t border-apple-neon/20 pt-6 text-left">
            <div class="text-[10px] text-apple-gray tracking-widest mb-4 uppercase">Items Ordered</div>
            <div
              v-for="item in orderData.items"
              :key="item.productId"
              class="flex justify-between py-2 border-b border-apple-neon/10"
            >
              <span class="text-white">{{ item.productName }} <span class="text-apple-gray">×{{ item.quantity }}</span></span>
              <span class="text-apple-neon tabular-nums">{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>
        </div>

        <div class="mt-12 flex flex-col md:flex-row gap-4 justify-center">
          <router-link to="/" class="px-8 py-3 border border-apple-neon/30 text-apple-gray text-xs hover:text-apple-neon hover:border-apple-neon transition-colors duration-300 tracking-widest">
            RETURN HOME
          </router-link>
          <router-link to="/shop" class="px-8 py-3 border border-apple-neon text-apple-neon text-xs hover:bg-apple-neon hover:text-black transition-colors duration-300 tracking-widest font-bold">
            CONTINUE SHOPPING
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>
