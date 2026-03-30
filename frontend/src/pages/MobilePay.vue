<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const orderId = ref('');
const orderData = ref<any>(null);
const loading = ref(true);
const processing = ref(false);
const paymentDone = ref(false);
const error = ref('');

function formatPrice(cents: number) {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

onMounted(async () => {
  window.scrollTo(0, 0);
  orderId.value = route.params.id as string;

  try {
    const res = await fetch(`/api/orders/${orderId.value}`);
    if (res.ok) {
      orderData.value = await res.json();

      // If already paid, show done state
      if (orderData.value.status === 'paid') {
        paymentDone.value = true;
      }
    }
  } catch {
    error.value = 'Failed to load order.';
  }
  loading.value = false;
});

async function handlePay() {
  processing.value = true;
  error.value = '';

  // Brief processing animation
  await new Promise((r) => setTimeout(r, 1500));

  try {
    const res = await fetch(`/api/orders/${orderId.value}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (res.ok && data.success) {
      paymentDone.value = true;
    } else {
      throw new Error(data.error || 'Payment failed.');
    }
  } catch (err: any) {
    error.value = err.message || 'Payment failed.';
    processing.value = false;
  }
}
</script>

<template>
  <!-- Mobile-optimized, full-screen payment page -->
  <div class="w-full min-h-screen bg-apple-black text-apple-light relative overflow-x-hidden flex flex-col">
    <div class="pointer-events-none absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] mix-blend-overlay z-0"></div>

    <div class="flex-1 flex flex-col items-center justify-center px-6 py-12 font-mono font-light relative z-10">

      <!-- Loading -->
      <div v-if="loading" class="text-apple-neon text-xs tracking-widest animate-pulse">
        LOADING...
      </div>

      <!-- Payment Success State -->
      <div v-else-if="paymentDone" class="flex flex-col items-center text-center max-w-md w-full">
        <div class="w-24 h-24 rounded-full border-2 border-apple-neon flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(0,255,65,0.3)] animate-scaleIn">
          <svg class="w-12 h-12 text-apple-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <div class="text-apple-neon text-xs tracking-[0.4em] mb-4 animate-pulse">
          ✓ PAYMENT CONFIRMED
        </div>

        <h1 class="text-2xl text-white font-sans font-light tracking-tight mb-4">
          Thank You!
        </h1>

        <p class="text-xs text-apple-gray tracking-widest mb-2">
          Order #{{ orderId }} has been paid
        </p>
        <p class="text-xs text-apple-gray tracking-widest">
          You can close this page
        </p>

        <div class="mt-8 text-[10px] text-apple-gray/50 tracking-widest">
          The checkout page will update automatically
        </div>
      </div>

      <!-- Payment Form -->
      <div v-else class="w-full max-w-md">

        <!-- Header -->
        <div class="text-center mb-8">
          <div class="text-[10px] tracking-widest text-apple-gray mb-2">SECURE PAYMENT</div>
          <h1 class="text-xl text-white font-sans font-light tracking-tight">
            Complete Payment
          </h1>
        </div>

        <!-- Order Card -->
        <div class="border border-apple-neon/20 p-6 bg-black/60 mb-6 relative">
          <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-apple-neon"></div>
          <div class="absolute top-0 right-0 w-3 h-3 border-t border-r border-apple-neon"></div>

          <div class="text-[10px] tracking-widest text-apple-gray mb-4 flex flex-wrap items-center gap-2">
            <span>ORDER #{{ orderId }} — {{ orderData?.customerName }}</span>
            <span class="px-2 py-0.5 border border-apple-neon/30 text-apple-neon bg-apple-neon/5 uppercase">
              {{ orderData?.paymentMethod === 'ewallet' ? `${orderData?.ewalletProvider || 'E-WALLET'}` : orderData?.paymentMethod || 'QR' }}
            </span>
          </div>

          <!-- Items -->
          <div v-if="orderData?.items" class="space-y-3 mb-4">
            <div
              v-for="item in orderData.items"
              :key="item.productId"
              class="flex justify-between text-xs"
            >
              <span class="text-apple-gray tracking-widest">
                {{ item.productName }} <span class="text-apple-gray/50">×{{ item.quantity }}</span>
              </span>
              <span class="text-white tabular-nums tracking-widest">
                {{ formatPrice(item.price * item.quantity) }}
              </span>
            </div>
          </div>

          <!-- Total -->
          <div class="border-t border-apple-neon/20 pt-4 flex justify-between items-center">
            <span class="text-xs text-apple-gray tracking-widest">TOTAL</span>
            <span class="text-xl text-apple-neon font-sans font-light tabular-nums">
              {{ orderData ? formatPrice(orderData.totalAmount) : '$0.00' }}
            </span>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="text-xs text-red-500 tracking-widest text-center mb-4">
          ERR: {{ error }}
        </div>

        <!-- Pay Button -->
        <button
          @click="handlePay"
          :disabled="processing"
          class="w-full py-5 border-2 border-apple-neon text-apple-neon font-bold tracking-widest text-lg hover:bg-apple-neon hover:text-black transition-all duration-300 shadow-[0_0_30px_rgba(0,255,65,0.3)] hover:shadow-[0_0_60px_rgba(0,255,65,0.6)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transform"
        >
          <span v-if="processing" class="animate-pulse flex items-center justify-center gap-3">
            <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.3"></circle>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            </svg>
            PROCESSING...
          </span>
          <span v-else>PAY {{ orderData ? formatPrice(orderData.totalAmount) : '' }}</span>
        </button>

        <div class="mt-4 text-[10px] text-apple-gray/50 tracking-widest text-center">
          🔒 Secure Payment Gateway
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scaleIn {
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
