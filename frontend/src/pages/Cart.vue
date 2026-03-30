<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import type { PaymentMethod, EwalletProvider } from '../stores/cart';

const cart = useCartStore();
const router = useRouter();

const isCheckingOut = ref(false);
const checkoutError = ref('');
const customerName = ref('');
const customerEmail = ref('');
const showCheckoutForm = ref(false);

const ewalletOptions: { id: EwalletProvider; name: string; icon: string; color: string }[] = [
  { id: 'gopay', name: 'GoPay', icon: '💚', color: '#00AA13' },
  { id: 'ovo', name: 'OVO', icon: '💜', color: '#4C3494' },
  { id: 'dana', name: 'DANA', icon: '💙', color: '#108EE9' },
];

async function handleCheckout() {
  if (cart.items.length === 0) return;

  if (!showCheckoutForm.value) {
    showCheckoutForm.value = true;
    return;
  }

  if (!customerName.value.trim() || !customerEmail.value.trim()) {
    checkoutError.value = 'Name and email are required.';
    return;
  }

  if (cart.paymentMethod === 'ewallet' && !cart.ewalletProvider) {
    checkoutError.value = 'Please select an e-wallet provider.';
    return;
  }

  isCheckingOut.value = true;
  checkoutError.value = '';

  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: customerName.value,
        customerEmail: customerEmail.value,
        items: cart.orderPayload(),
        paymentMethod: cart.paymentMethod,
        ewalletProvider: cart.ewalletProvider || undefined,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `Server error (${response.status})`);
    }

    const data = await response.json();

    // Redirect to payment page
    router.push(`/order/pay/${data.orderId}`);
  } catch (err: any) {
    checkoutError.value = err.message || 'An error occurred.';
    isCheckingOut.value = false;
  }
}

function formatItemPrice(item: any, isSubtotal: boolean = false) {
  if (item.productId === 'mclass-core-node') {
    return '∞';
  }
  const cents = isSubtotal ? item.price * item.quantity : item.price;
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

function selectPaymentMethod(method: PaymentMethod) {
  cart.setPaymentMethod(method);
  if (method !== 'ewallet') {
    cart.setEwalletProvider('');
  }
}

function selectEwallet(provider: EwalletProvider) {
  cart.setEwalletProvider(provider);
}

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <div class="w-full min-h-screen bg-apple-black text-apple-light relative overflow-x-hidden pt-32 pb-16">
    <div class="pointer-events-none absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] mix-blend-overlay z-0"></div>

    <div class="max-w-5xl mx-auto px-6 font-mono font-light relative z-10">
      <div class="absolute top-0 bottom-0 left-6 w-[1px] bg-apple-neon/10 pointer-events-none hidden md:block"></div>
      <div class="absolute top-0 bottom-0 right-6 w-[1px] bg-apple-neon/10 pointer-events-none hidden md:block"></div>

      <section class="py-16 md:py-24">
        <h2 class="text-xs tracking-widest text-apple-neon uppercase mb-16 flex items-center gap-4">
          <span class="w-1 h-3 bg-apple-neon inline-block animate-pulse"></span>
          Cart Manifest_
        </h2>

        <!-- Empty State -->
        <div v-if="cart.items.length === 0" class="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <div class="text-apple-gray tracking-widest text-sm mb-8">[ CART EMPTY — NO UNITS QUEUED ]</div>
          <router-link to="/shop" class="px-8 py-3 border border-apple-neon text-apple-neon text-xs hover:bg-apple-neon hover:text-black transition-colors duration-300 font-bold tracking-widest">
            RETURN TO SHOP
          </router-link>
        </div>

        <!-- Cart Items -->
        <div v-else>
          <!-- Header Row -->
          <div class="hidden md:flex items-center text-xs tracking-widest text-apple-gray border-b border-apple-neon/20 py-4 uppercase">
            <div class="flex-1 min-w-[200px]">Unit</div>
            <div class="w-32 text-center shrink-0">Price</div>
            <div class="w-32 text-center shrink-0">Qty</div>
            <div class="w-32 text-right shrink-0">Subtotal</div>
            <div class="w-16 text-right shrink-0">Cmd</div>
          </div>

          <!-- Item Rows -->
          <div
            v-for="item in cart.items"
            :key="item.productId"
            class="flex flex-col md:flex-row md:items-center py-6 border-b border-apple-neon/10 hover:bg-apple-neon/5 transition-colors gap-6 md:gap-0"
          >
            <!-- Product Info -->
            <div class="flex-1 min-w-[200px] flex items-center gap-4">
              <div class="w-16 h-16 border border-apple-neon/20 overflow-hidden shrink-0 relative">
                <div class="absolute inset-0 bg-apple-neon mix-blend-overlay opacity-20 z-10"></div>
                <img :src="item.image" class="w-full h-full object-cover filter contrast-125 sepia-[.2] hue-rotate-[70deg]" alt="item" />
              </div>
              <span class="text-sm tracking-widest text-white uppercase break-words">{{ item.name }}</span>
            </div>

            <div class="flex justify-between md:justify-end items-center md:items-center w-full md:w-auto">
              <!-- Unit Price -->
              <div class="w-auto md:w-32 text-left md:text-center text-sm text-apple-gray tracking-widest shrink-0">
                <span class="md:hidden text-[10px] mr-2">PRICE:</span>
                {{ formatItemPrice(item) }}
              </div>

              <!-- Quantity Controls -->
              <div class="w-auto md:w-32 flex items-center justify-end md:justify-center gap-3 shrink-0">
                <button
                  @click="cart.updateQuantity(item.productId, item.quantity - 1)"
                  class="w-8 h-8 border border-apple-neon/30 text-apple-neon hover:bg-apple-neon hover:text-black transition-colors text-xs flex items-center justify-center cursor-pointer"
                >
                  −
                </button>
                <span class="text-white w-6 text-center tabular-nums">{{ item.quantity }}</span>
                <button
                  @click="cart.updateQuantity(item.productId, item.quantity + 1)"
                  class="w-8 h-8 border border-apple-neon/30 text-apple-neon hover:bg-apple-neon hover:text-black transition-colors text-xs flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div class="flex justify-between md:justify-end items-center w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t border-apple-neon/10 md:border-t-0">
              <!-- Subtotal -->
              <div class="w-auto md:w-32 text-left md:text-right text-sm text-apple-neon tracking-widest tabular-nums font-bold shrink-0">
                <span class="md:hidden text-[10px] mr-2 text-apple-gray">SUBTOTAL:</span>
                {{ formatItemPrice(item, true) }}
              </div>

              <!-- Remove -->
              <div class="w-auto md:w-16 text-right shrink-0">
                <button
                  @click="cart.removeItem(item.productId)"
                  class="text-xs text-red-500 hover:text-red-400 tracking-widest transition-colors uppercase border border-red-500/20 px-3 py-1 bg-red-500/5 hover:bg-red-500/20"
                >
                  DEL
                </button>
              </div>
            </div>
          </div>

          <!-- Customer Info + Payment Method Form -->
          <div
            v-if="showCheckoutForm"
            class="mt-12 border border-apple-neon/20 p-8 bg-black/60 relative animate-fadeIn"
          >
            <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-apple-neon"></div>
            <div class="absolute top-0 right-0 w-3 h-3 border-t border-r border-apple-neon"></div>
            <div class="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-apple-neon"></div>
            <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-apple-neon"></div>

            <h3 class="text-xs tracking-widest text-apple-neon uppercase mb-8 flex items-center gap-3">
              <span class="w-1 h-3 bg-apple-neon inline-block animate-pulse"></span>
              Customer Identification_
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <label class="text-[10px] tracking-widest text-apple-gray uppercase block mb-2">Full Name</label>
                <input
                  v-model="customerName"
                  type="text"
                  placeholder="JOHN DOE"
                  class="w-full bg-black/80 border border-apple-neon/30 px-4 py-3 text-white text-sm tracking-widest focus:border-apple-neon focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all placeholder:text-apple-gray/30 font-mono uppercase"
                />
              </div>
              <div>
                <label class="text-[10px] tracking-widest text-apple-gray uppercase block mb-2">Email Address</label>
                <input
                  v-model="customerEmail"
                  type="email"
                  placeholder="john@example.com"
                  class="w-full bg-black/80 border border-apple-neon/30 px-4 py-3 text-white text-sm tracking-widest focus:border-apple-neon focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all placeholder:text-apple-gray/30 font-mono"
                />
              </div>
            </div>

            <!-- Payment Method Selection -->
            <h3 class="text-xs tracking-widest text-apple-neon uppercase mb-6 flex items-center gap-3">
              <span class="w-1 h-3 bg-apple-neon inline-block animate-pulse"></span>
              Payment Method_
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <!-- QR Code -->
              <button
                @click="selectPaymentMethod('qr')" 
                :class="[
                  'relative flex flex-col items-center gap-3 p-6 border transition-all duration-300 group text-left',
                  cart.paymentMethod === 'qr'
                    ? 'border-apple-neon bg-apple-neon/10 shadow-[0_0_20px_rgba(0,255,65,0.15)]'
                    : 'border-apple-neon/20 bg-black/40 hover:border-apple-neon/50'
                ]"
              >
                <div class="text-3xl">📱</div>
                <div class="text-xs tracking-widest text-white font-bold uppercase">QR Code</div>
                <div class="text-[10px] tracking-wider text-apple-gray">Scan & pay from phone</div>
                <div v-if="cart.paymentMethod === 'qr'" class="absolute top-2 right-2 w-2 h-2 rounded-full bg-apple-neon shadow-[0_0_8px_rgba(0,255,65,0.8)]"></div>
              </button>

              <!-- E-Wallet -->
              <button
                @click="selectPaymentMethod('ewallet')"
                :class="[
                  'relative flex flex-col items-center gap-3 p-6 border transition-all duration-300 group text-left',
                  cart.paymentMethod === 'ewallet'
                    ? 'border-apple-neon bg-apple-neon/10 shadow-[0_0_20px_rgba(0,255,65,0.15)]'
                    : 'border-apple-neon/20 bg-black/40 hover:border-apple-neon/50'
                ]"
              >
                <div class="text-3xl">💳</div>
                <div class="text-xs tracking-widest text-white font-bold uppercase">E-Wallet</div>
                <div class="text-[10px] tracking-wider text-apple-gray">GoPay, OVO, DANA</div>
                <div v-if="cart.paymentMethod === 'ewallet'" class="absolute top-2 right-2 w-2 h-2 rounded-full bg-apple-neon shadow-[0_0_8px_rgba(0,255,65,0.8)]"></div>
              </button>

              <!-- Card -->
              <button
                @click="selectPaymentMethod('card')"
                :class="[
                  'relative flex flex-col items-center gap-3 p-6 border transition-all duration-300 group text-left',
                  cart.paymentMethod === 'card'
                    ? 'border-apple-neon bg-apple-neon/10 shadow-[0_0_20px_rgba(0,255,65,0.15)]'
                    : 'border-apple-neon/20 bg-black/40 hover:border-apple-neon/50'
                ]"
              >
                <div class="text-3xl">🏦</div>
                <div class="text-xs tracking-widest text-white font-bold uppercase">Card</div>
                <div class="text-[10px] tracking-wider text-apple-gray">Credit / Debit card</div>
                <div v-if="cart.paymentMethod === 'card'" class="absolute top-2 right-2 w-2 h-2 rounded-full bg-apple-neon shadow-[0_0_8px_rgba(0,255,65,0.8)]"></div>
              </button>
            </div>

            <!-- E-Wallet Provider Sub-Selector -->
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 -translate-y-2 max-h-0"
              enter-to-class="opacity-100 translate-y-0 max-h-40"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0 max-h-40"
              leave-to-class="opacity-0 -translate-y-2 max-h-0"
            >
              <div v-if="cart.paymentMethod === 'ewallet'" class="overflow-hidden mb-4">
                <div class="text-[10px] tracking-widest text-apple-gray uppercase mb-3">Select Provider</div>
                <div class="flex gap-3 flex-wrap">
                  <button
                    v-for="ew in ewalletOptions"
                    :key="ew.id"
                    @click="selectEwallet(ew.id)"
                    :class="[
                      'flex items-center gap-2 px-5 py-3 border transition-all duration-300 text-xs tracking-widest font-bold uppercase',
                      cart.ewalletProvider === ew.id
                        ? 'border-apple-neon bg-apple-neon/10 text-apple-neon shadow-[0_0_15px_rgba(0,255,65,0.2)]'
                        : 'border-apple-neon/20 bg-black/40 text-apple-gray hover:border-apple-neon/40 hover:text-white'
                    ]"
                  >
                    <span>{{ ew.icon }}</span>
                    <span>{{ ew.name }}</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <!-- Totals & Checkout -->
          <div class="mt-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div class="text-xs text-apple-gray tracking-widest mb-2">TOTAL REQUISITION COST</div>
              <div class="text-3xl md:text-4xl text-white font-sans font-light tabular-nums">
                {{ cart.totalDisplay }}
              </div>
              <div class="text-xs text-apple-gray tracking-widest mt-1">
                {{ cart.itemCount }} UNIT{{ cart.itemCount > 1 ? 'S' : '' }} QUEUED
              </div>
              <div v-if="showCheckoutForm" class="text-[10px] text-apple-neon tracking-widest mt-2 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-apple-neon inline-block"></span>
                {{ cart.paymentMethod === 'qr' ? 'QR CODE' : cart.paymentMethod === 'ewallet' ? `E-WALLET · ${cart.ewalletProvider.toUpperCase() || '...'}` : 'CARD' }}
              </div>
            </div>

            <div class="flex flex-col items-end gap-4">
              <div v-if="checkoutError" class="text-xs text-red-500 tracking-widest max-w-sm text-right">
                ERR: {{ checkoutError }}
              </div>
              <button
                @click="handleCheckout"
                :disabled="isCheckingOut"
                class="px-12 py-4 border-2 border-apple-neon text-apple-neon font-bold tracking-widest hover:bg-apple-neon hover:text-black transition-all duration-300 shadow-[0_0_30px_rgba(0,255,65,0.2)] hover:shadow-[0_0_60px_rgba(0,255,65,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isCheckingOut ? 'PROCESSING...' : showCheckoutForm ? 'PLACE ORDER →' : 'PROCEED TO CHECKOUT' }}
              </button>
              <button @click="cart.clearCart()" class="text-xs text-apple-gray hover:text-red-500 tracking-widest transition-colors">
                PURGE CART
              </button>
            </div>
          </div>

        </div>

      </section>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}
</style>
