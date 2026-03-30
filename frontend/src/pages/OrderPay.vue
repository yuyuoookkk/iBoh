<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';

const route = useRoute();
const router = useRouter();
const cart = useCartStore();

const orderId = ref('');
const orderData = ref<any>(null);
const loading = ref(true);
const pollTimer = ref<number | null>(null);

// Card form state
const cardNumber = ref('');
const cardExpiry = ref('');
const cardCvv = ref('');
const cardProcessing = ref(false);
const cardError = ref('');

// E-wallet state
const ewalletProcessing = ref(false);
const ewalletStep = ref<'confirm' | 'processing' | 'done'>('confirm');

function formatTotalAmount(cents: number) {
  if (orderData.value?.items?.some((i: any) => i.productId === 'mclass-core-node')) {
    return '∞';
  }
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

function formatItemPrice(item: any, isSubtotal: boolean = false) {
  if (item.productId === 'mclass-core-node') {
    return '∞';
  }
  const cents = isSubtotal ? item.price * item.quantity : item.price;
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

const paymentMethod = computed(() => orderData.value?.paymentMethod || 'qr');
const ewalletProvider = computed(() => orderData.value?.ewalletProvider || '');

const ewalletInfo: Record<string, { name: string; icon: string; color: string; gradient: string }> = {
  gopay: { name: 'GoPay', icon: '💚', color: '#00AA13', gradient: 'from-green-900/30 to-green-600/10' },
  ovo: { name: 'OVO', icon: '💜', color: '#4C3494', gradient: 'from-purple-900/30 to-purple-600/10' },
  dana: { name: 'DANA', icon: '💙', color: '#108EE9', gradient: 'from-blue-900/30 to-blue-600/10' },
};

const currentEwallet = computed(() => ewalletInfo[ewalletProvider.value] || ewalletInfo.gopay);

async function fetchOrder() {
  try {
    const res = await fetch(`/api/orders/${orderId.value}`);
    if (res.ok) {
      const data = await res.json();
      orderData.value = data;

      // If payment detected, redirect to success!
      if (data.status === 'paid') {
        stopPolling();
        cart.clearCart();
        router.push(`/order/success?order_id=${orderId.value}`);
      }
    }
  } catch {
    // Silently retry on next poll
  }
}

function startPolling() {
  pollTimer.value = window.setInterval(() => {
    fetchOrder();
  }, 2000);
}

function stopPolling() {
  if (pollTimer.value) {
    clearInterval(pollTimer.value);
    pollTimer.value = null;
  }
}

// Format card number with spaces
function formatCardNumber(e: Event) {
  const input = e.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '').substring(0, 16);
  value = value.replace(/(.{4})/g, '$1 ').trim();
  cardNumber.value = value;
}

// Format expiry as MM/YY
function formatExpiry(e: Event) {
  const input = e.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '').substring(0, 4);
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2);
  }
  cardExpiry.value = value;
}

// Card Payment
async function handleCardPay() {
  cardError.value = '';

  const cleanCard = cardNumber.value.replace(/\s/g, '');
  if (cleanCard.length < 13) {
    cardError.value = 'Invalid card number.';
    return;
  }
  if (cardExpiry.value.length < 5) {
    cardError.value = 'Invalid expiry date.';
    return;
  }
  if (cardCvv.value.length < 3) {
    cardError.value = 'Invalid CVV.';
    return;
  }

  cardProcessing.value = true;

  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 2000));

  try {
    const res = await fetch(`/api/orders/${orderId.value}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (res.ok && data.success) {
      stopPolling();
      cart.clearCart();
      router.push(`/order/success?order_id=${orderId.value}`);
    } else {
      throw new Error(data.error || 'Payment failed.');
    }
  } catch (err: any) {
    cardError.value = err.message || 'Payment failed.';
    cardProcessing.value = false;
  }
}

// E-Wallet Payment
async function handleEwalletPay() {
  ewalletProcessing.value = true;
  ewalletStep.value = 'processing';

  // Simulate opening external wallet + processing
  await new Promise((r) => setTimeout(r, 2500));

  try {
    const res = await fetch(`/api/orders/${orderId.value}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (res.ok && data.success) {
      ewalletStep.value = 'done';
      stopPolling();
      await new Promise((r) => setTimeout(r, 1500));
      cart.clearCart();
      router.push(`/order/success?order_id=${orderId.value}`);
    } else {
      throw new Error(data.error || 'Payment failed.');
    }
  } catch (err: any) {
    cardError.value = err.message;
    ewalletProcessing.value = false;
    ewalletStep.value = 'confirm';
  }
}

onMounted(async () => {
  window.scrollTo(0, 0);
  orderId.value = route.params.id as string;

  await fetchOrder();
  loading.value = false;

  // Only poll for QR method (ewallet and card handle payment inline)
  if (paymentMethod.value === 'qr') {
    startPolling();
  }
});

onUnmounted(() => {
  stopPolling();
});
</script>

<template>
  <div class="w-full min-h-screen bg-apple-black text-apple-light relative overflow-x-hidden pt-24 pb-16">
    <div class="pointer-events-none absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] mix-blend-overlay z-0"></div>

    <div class="max-w-4xl mx-auto px-6 font-mono font-light relative z-10">

      <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-apple-neon text-xs tracking-widest animate-pulse">LOADING ORDER DATA...</div>
      </div>

      <div v-else class="flex flex-col items-center py-12">

        <!-- Header -->
        <h2 class="text-xs tracking-widest text-apple-neon uppercase mb-4 flex items-center gap-3">
          <span class="w-1 h-3 bg-apple-neon inline-block animate-pulse"></span>
          {{ paymentMethod === 'qr' ? 'QR Payment Gateway_' : paymentMethod === 'ewallet' ? 'E-Wallet Payment_' : 'Card Payment_' }}
        </h2>
        <p class="text-xs text-apple-gray tracking-widest mb-12 text-center">
          {{ paymentMethod === 'qr' ? 'Scan the QR code below with your phone to complete payment'
             : paymentMethod === 'ewallet' ? `Complete payment via ${currentEwallet.name}`
             : 'Enter your card details to complete payment' }}
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">

          <!-- ═══════════════════════════════════════════════════════════════ -->
          <!-- LEFT PANEL: Payment Interface (varies by method)              -->
          <!-- ═══════════════════════════════════════════════════════════════ -->
          <div class="border border-apple-neon/20 p-8 bg-black/60 relative flex flex-col items-center justify-center">
            <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-apple-neon"></div>
            <div class="absolute top-0 right-0 w-3 h-3 border-t border-r border-apple-neon"></div>
            <div class="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-apple-neon"></div>
            <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-apple-neon"></div>

            <!-- ═══ QR CODE METHOD ═══ -->
            <template v-if="paymentMethod === 'qr'">
              <div class="relative w-64 h-64 md:w-72 md:h-72">
                <div class="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                  <div class="qr-scan-line absolute left-0 right-0 h-[2px] bg-apple-neon shadow-[0_0_20px_rgba(0,255,65,0.8)]"></div>
                </div>
                <div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-apple-neon z-10"></div>
                <div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-apple-neon z-10"></div>
                <div class="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-apple-neon z-10"></div>
                <div class="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-apple-neon z-10"></div>
                <img
                  :src="`/api/orders/${orderId}/qr`"
                  alt="Payment QR Code"
                  class="w-full h-full object-contain p-4"
                />
              </div>

              <div class="mt-6 flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                <span class="text-xs tracking-widest text-yellow-500">AWAITING PAYMENT...</span>
              </div>

              <div class="mt-4 text-[10px] text-apple-gray tracking-widest text-center">
                ORDER #{{ orderId }}
              </div>
            </template>

            <!-- ═══ E-WALLET METHOD ═══ -->
            <template v-else-if="paymentMethod === 'ewallet'">
              <div class="w-full flex flex-col items-center">
                <!-- Provider Badge -->
                <div :class="['w-full p-6 rounded-sm bg-gradient-to-br mb-6 border border-apple-neon/10 flex flex-col items-center', currentEwallet.gradient]">
                  <div class="text-5xl mb-3">{{ currentEwallet.icon }}</div>
                  <div class="text-lg font-bold tracking-widest text-white uppercase">{{ currentEwallet.name }}</div>
                  <div class="text-[10px] tracking-widest text-apple-gray mt-1">E-WALLET PAYMENT</div>
                </div>

                <!-- Amount -->
                <div class="text-3xl text-white font-sans font-light tabular-nums mb-6">
                  {{ orderData ? formatTotalAmount(orderData.totalAmount) : '$0.00' }}
                </div>

                <!-- States -->
                <template v-if="ewalletStep === 'confirm'">
                  <button
                    @click="handleEwalletPay"
                    class="w-full py-4 border-2 border-apple-neon text-apple-neon font-bold tracking-widest hover:bg-apple-neon hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(0,255,65,0.2)] hover:shadow-[0_0_40px_rgba(0,255,65,0.5)] active:scale-95 transform"
                  >
                    PAY WITH {{ currentEwallet.name.toUpperCase() }}
                  </button>
                  <div class="mt-3 text-[10px] text-apple-gray tracking-widest">
                    ORDER #{{ orderId }}
                  </div>
                </template>

                <template v-else-if="ewalletStep === 'processing'">
                  <div class="flex flex-col items-center gap-4">
                    <div class="w-12 h-12 border-2 border-apple-neon/30 border-t-apple-neon rounded-full animate-spin"></div>
                    <div class="text-xs tracking-widest text-apple-neon animate-pulse">
                      CONNECTING TO {{ currentEwallet.name.toUpperCase() }}...
                    </div>
                    <div class="text-[10px] text-apple-gray tracking-widest">
                      Processing payment securely
                    </div>
                  </div>
                </template>

                <template v-else-if="ewalletStep === 'done'">
                  <div class="flex flex-col items-center gap-4">
                    <div class="w-16 h-16 rounded-full border-2 border-apple-neon flex items-center justify-center shadow-[0_0_30px_rgba(0,255,65,0.3)] animate-scaleIn">
                      <svg class="w-8 h-8 text-apple-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div class="text-xs tracking-widest text-apple-neon animate-pulse">
                      ✓ PAYMENT CONFIRMED
                    </div>
                    <div class="text-[10px] text-apple-gray tracking-widest">Redirecting...</div>
                  </div>
                </template>
              </div>
            </template>

            <!-- ═══ CARD METHOD ═══ -->
            <template v-else-if="paymentMethod === 'card'">
              <div class="w-full">
                <!-- Visual Card Preview -->
                <div class="w-full aspect-[1.6/1] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-sm p-6 mb-8 border border-apple-neon/20 relative overflow-hidden flex flex-col justify-between">
                  <div class="absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(0,255,65,0.05)_50%,transparent_60%)] pointer-events-none"></div>
                  <div class="absolute top-0 right-0 w-20 h-20 rounded-full bg-apple-neon/5 blur-xl"></div>

                  <div class="flex justify-between items-start">
                    <div class="text-[10px] tracking-widest text-apple-gray">CREDIT / DEBIT</div>
                    <div class="text-apple-neon text-xs tracking-widest font-bold">PAKJAPI</div>
                  </div>

                  <div class="text-lg md:text-xl tracking-[0.3em] text-white font-light tabular-nums">
                    {{ cardNumber || '•••• •••• •••• ••••' }}
                  </div>

                  <div class="flex justify-between items-end">
                    <div>
                      <div class="text-[9px] tracking-widest text-apple-gray mb-0.5">EXPIRES</div>
                      <div class="text-xs tracking-widest text-white tabular-nums">{{ cardExpiry || 'MM/YY' }}</div>
                    </div>
                    <div>
                      <div class="text-[9px] tracking-widest text-apple-gray mb-0.5">CVV</div>
                      <div class="text-xs tracking-widest text-white">{{ cardCvv ? '•'.repeat(cardCvv.length) : '•••' }}</div>
                    </div>
                  </div>
                </div>

                <!-- Card Form -->
                <div class="space-y-4">
                  <div>
                    <label class="text-[10px] tracking-widest text-apple-gray uppercase block mb-2">Card Number</label>
                    <input
                      :value="cardNumber"
                      @input="formatCardNumber"
                      type="text"
                      inputmode="numeric"
                      placeholder="1234 5678 9012 3456"
                      maxlength="19"
                      class="w-full bg-black/80 border border-apple-neon/30 px-4 py-3 text-white text-sm tracking-[0.2em] focus:border-apple-neon focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all placeholder:text-apple-gray/30 font-mono tabular-nums"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-[10px] tracking-widest text-apple-gray uppercase block mb-2">Expiry</label>
                      <input
                        :value="cardExpiry"
                        @input="formatExpiry"
                        type="text"
                        inputmode="numeric"
                        placeholder="MM/YY"
                        maxlength="5"
                        class="w-full bg-black/80 border border-apple-neon/30 px-4 py-3 text-white text-sm tracking-[0.2em] focus:border-apple-neon focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all placeholder:text-apple-gray/30 font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label class="text-[10px] tracking-widest text-apple-gray uppercase block mb-2">CVV</label>
                      <input
                        v-model="cardCvv"
                        type="password"
                        inputmode="numeric"
                        placeholder="•••"
                        maxlength="4"
                        class="w-full bg-black/80 border border-apple-neon/30 px-4 py-3 text-white text-sm tracking-[0.2em] focus:border-apple-neon focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all placeholder:text-apple-gray/30 font-mono"
                      />
                    </div>
                  </div>

                  <!-- Card Error -->
                  <div v-if="cardError" class="text-xs text-red-500 tracking-widest">
                    ERR: {{ cardError }}
                  </div>

                  <!-- Pay Button -->
                  <button
                    @click="handleCardPay"
                    :disabled="cardProcessing"
                    class="w-full py-4 border-2 border-apple-neon text-apple-neon font-bold tracking-widest hover:bg-apple-neon hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(0,255,65,0.2)] hover:shadow-[0_0_40px_rgba(0,255,65,0.5)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transform mt-2"
                  >
                    <span v-if="cardProcessing" class="animate-pulse flex items-center justify-center gap-3">
                      <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.3"></circle>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                      </svg>
                      PROCESSING...
                    </span>
                    <span v-else>PAY {{ orderData ? formatTotalAmount(orderData.totalAmount) : '' }}</span>
                  </button>

                  <div class="text-[10px] text-apple-gray/50 tracking-widest text-center">
                    🔒 Secure simulated payment
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- ═══════════════════════════════════════════════════════════════ -->
          <!-- RIGHT PANEL: Order Summary (shared across all methods)        -->
          <!-- ═══════════════════════════════════════════════════════════════ -->
          <div class="border border-apple-neon/20 p-8 bg-black/60 relative">
            <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-apple-neon"></div>
            <div class="absolute top-0 right-0 w-3 h-3 border-t border-r border-apple-neon"></div>

            <h3 class="text-xs tracking-widest text-apple-neon uppercase mb-8 flex items-center gap-3">
              <span class="w-1 h-3 bg-apple-neon inline-block"></span>
              Order Summary_
            </h3>

            <!-- Customer info -->
            <div class="mb-6 space-y-2 border-b border-apple-neon/10 pb-6">
              <div class="text-[10px] tracking-widest text-apple-gray">
                CUSTOMER: <span class="text-white">{{ orderData?.customerName }}</span>
              </div>
              <div class="text-[10px] tracking-widest text-apple-gray">
                EMAIL: <span class="text-white">{{ orderData?.customerEmail }}</span>
              </div>
              <div class="text-[10px] tracking-widest text-apple-gray">
                METHOD: <span class="text-apple-neon uppercase">
                  {{ paymentMethod === 'qr' ? 'QR CODE' : paymentMethod === 'ewallet' ? `E-WALLET · ${currentEwallet.name}` : 'CARD' }}
                </span>
              </div>
            </div>

            <!-- Items -->
            <div v-if="orderData?.items" class="space-y-4 mb-8">
              <div
                v-for="item in orderData.items"
                :key="item.productId"
                class="flex justify-between items-center text-sm border-b border-apple-neon/10 pb-4"
              >
                <div>
                  <div class="text-white tracking-widest uppercase text-xs">{{ item.productName }}</div>
                  <div class="text-[10px] text-apple-gray mt-1">QTY: {{ item.quantity }}</div>
                </div>
                <div class="text-apple-neon tabular-nums tracking-widest text-sm">
                  {{ formatItemPrice(item, true) }}
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="border-t border-apple-neon/30 pt-6 flex justify-between items-center">
              <div class="text-xs text-apple-gray tracking-widest">TOTAL</div>
              <div class="text-2xl text-white font-sans font-light tabular-nums">
                {{ orderData ? formatTotalAmount(orderData.totalAmount) : '$0.00' }}
              </div>
            </div>

            <!-- Instructions -->
            <div v-if="paymentMethod === 'qr'" class="mt-8 border border-apple-neon/20 bg-apple-neon/5 px-4 py-4 text-[10px] tracking-widest text-apple-neon space-y-2">
              <div>1. Open your phone camera</div>
              <div>2. Scan the QR code</div>
              <div>3. Tap "PAY NOW" on your phone</div>
              <div>4. This page will auto-update ✓</div>
            </div>

            <div v-else-if="paymentMethod === 'ewallet'" class="mt-8 border border-apple-neon/20 bg-apple-neon/5 px-4 py-4 text-[10px] tracking-widest text-apple-neon space-y-2">
              <div>1. Click "PAY WITH {{ currentEwallet.name.toUpperCase() }}"</div>
              <div>2. Confirm the payment</div>
              <div>3. You will be redirected automatically ✓</div>
            </div>

            <div v-else class="mt-8 border border-apple-neon/20 bg-apple-neon/5 px-4 py-4 text-[10px] tracking-widest text-apple-neon space-y-2">
              <div>1. Enter your card details</div>
              <div>2. Click "PAY" to process</div>
              <div>3. You will be redirected automatically ✓</div>
            </div>
          </div>

        </div>

        <!-- Cancel -->
        <router-link
          to="/cart"
          class="mt-8 text-xs text-apple-gray hover:text-red-500 tracking-widest transition-colors"
        >
          ← CANCEL & RETURN TO CART
        </router-link>

      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scanLine {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}
.qr-scan-line {
  animation: scanLine 3s ease-in-out infinite;
}
@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scaleIn {
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
