<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCartStore, type Product } from '../stores/cart';

const cart = useCartStore();
const products = ref<Product[]>([]);
const loading = ref(true);

onMounted(async () => {
  window.scrollTo(0, 0);

  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      products.value = await res.json();
    }
  } catch {
    // Server unreachable — will use fallback below
  }

  // Fallback if server is down or returned an error
  if (products.value.length === 0) {
    products.value = [
      {
        id: 'mclass-core-node',
        name: 'M-Class Core Node',
        description: 'The foundational neural processor. 16 cores, 31.4 Teraflops.',
        price: 199900,
        displayPrice: '$1,999.00',
        image: '/sequence/ezgif-frame-001.jpg',
      },
      {
        id: 'mclass-core-matrix',
        name: 'M-Class Core Matrix',
        description: 'Dual-die architecture with expanded unified memory.',
        price: 349900,
        displayPrice: '$3,499.00',
        image: '/sequence/ezgif-frame-050.jpg',
      },
      {
        id: 'mclass-quantum-array',
        name: 'M-Class Quantum Array',
        description: 'For enterprise-grade rendering and real-time physical simulations.',
        price: 599900,
        displayPrice: '$5,999.00',
        image: '/sequence/ezgif-frame-100.jpg',
      },
    ];
  }
  loading.value = false;
});

function isInCart(productId: string) {
  return cart.items.some((i) => i.productId === productId);
}

function getQty(productId: string) {
  const item = cart.items.find((i) => i.productId === productId);
  return item ? item.quantity : 0;
}
</script>

<template>
  <div class="w-full min-h-screen bg-apple-black text-apple-light relative overflow-x-hidden pt-32 pb-16">
    <div class="pointer-events-none absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] mix-blend-overlay z-0"></div>

    <div class="max-w-7xl mx-auto px-6 font-mono font-light relative z-10">
      <div class="absolute top-0 bottom-0 left-6 w-[1px] bg-apple-neon/10 pointer-events-none hidden md:block"></div>
      <div class="absolute top-0 bottom-0 right-6 w-[1px] bg-apple-neon/10 pointer-events-none hidden md:block"></div>

      <section class="py-16 md:py-32">
        <div class="flex justify-between items-center mb-16">
          <h2 class="text-xs tracking-widest text-apple-neon uppercase flex items-center gap-4">
            <span class="w-1 h-3 bg-apple-neon inline-block animate-pulse"></span>
            Hardware Requisition_
          </h2>
          <router-link
            to="/cart"
            class="text-xs tracking-widest border border-apple-neon px-4 py-2 text-apple-neon hover:bg-apple-neon hover:text-black transition-colors duration-300 flex items-center gap-2"
          >
            <span>CART</span>
            <span v-if="cart.itemCount > 0" class="bg-apple-neon text-black px-2 py-0.5 text-[10px] font-bold">
              {{ cart.itemCount }}
            </span>
          </router-link>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center min-h-[40vh]">
          <div class="text-apple-neon text-xs tracking-widest animate-pulse">LOADING CATALOG...</div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div v-for="p in products" :key="p.id" class="group border border-apple-neon/20 p-6 flex flex-col justify-between relative bg-black/40 hover:border-apple-neon/50 transition-colors duration-500 overflow-hidden">
              
              <div class="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,255,65,0.05)_50%,transparent_100%)] bg-[length:100%_200%] opacity-0 group-hover:opacity-100 animate-[scan_4s_linear_infinite] pointer-events-none z-10"></div>

              <div>
                <div class="aspect-square mb-6 border border-apple-neon/20 overflow-hidden relative">
                   <div class="absolute inset-0 bg-apple-neon mix-blend-overlay opacity-20"></div>
                   <img :src="p.image" class="w-full h-full object-cover filter contrast-125 sepia-[.2] hue-rotate-[70deg] scale-110 group-hover:scale-100 transition-transform duration-700" alt="product" />
                </div>
                
                <h3 class="text-xl font-bold tracking-widest text-white mb-2 uppercase">{{ p.name }}</h3>
                <p class="text-xs text-apple-gray tracking-wide leading-relaxed min-h-[48px]">{{ p.description }}</p>
              </div>

              <div class="mt-8 flex justify-between items-center border-t border-apple-neon/20 pt-6">
                 <div class="text-apple-neon tracking-widest">{{ p.displayPrice }}</div>

                 <!-- Add / In Cart state -->
                 <div v-if="isInCart(p.id)" class="flex items-center gap-2">
                   <span class="text-[10px] text-apple-gray tracking-widest">×{{ getQty(p.id) }}</span>
                   <button @click="cart.addItem(p)" class="px-4 py-2 bg-apple-neon/10 border border-apple-neon text-apple-neon text-xs hover:bg-apple-neon hover:text-black transition-colors duration-300 font-bold tracking-widest">
                     ADD +
                   </button>
                 </div>
                 <button v-else @click="cart.addItem(p)" class="px-6 py-2 border border-apple-neon text-apple-neon text-xs hover:bg-apple-neon hover:text-black transition-colors duration-300 font-bold tracking-widest">
                   ADD UNIT
                 </button>
              </div>
           </div>
        </div>

        <!-- Bottom Cart Bar -->
        <div v-if="cart.itemCount > 0" class="mt-16 border-t border-apple-neon/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="text-xs text-apple-gray tracking-widest">
            {{ cart.itemCount }} UNIT{{ cart.itemCount > 1 ? 'S' : '' }} IN CART — TOTAL: <span class="text-apple-neon">{{ cart.totalDisplay }}</span>
          </div>
          <router-link to="/cart" class="px-10 py-3 border-2 border-apple-neon text-apple-neon font-bold tracking-widest text-sm hover:bg-apple-neon hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(0,255,65,0.2)]">
            VIEW CART >
          </router-link>
        </div>

      </section>
    </div>
  </div>
</template>

<style scoped>
@keyframes scan {
  from { background-position: 0 0; }
  to { background-position: 0 100%; }
}
</style>
