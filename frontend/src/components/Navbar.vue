<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '../stores/cart';

const isOpen = ref(false);
const cart = useCartStore();
</script>

<template>
  <nav class="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center text-apple-neon font-mono uppercase tracking-widest text-sm mix-blend-difference pointer-events-auto">
    <router-link to="/" class="cursor-pointer hover:opacity-80 transition-opacity select-none normal-case">iBoh</router-link>
    <div class="flex items-center gap-6">
      <router-link to="/cart" class="relative cursor-pointer hover:opacity-80 transition-opacity select-none" title="Cart">
        CART
        <span v-if="cart.itemCount > 0" class="absolute -top-2 -right-4 bg-apple-neon text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center">
          {{ cart.itemCount }}
        </span>
      </router-link>
      <div @click="isOpen = !isOpen" class="cursor-pointer hover:animate-pulse select-none">
        [ {{ isOpen ? 'CLOSE' : 'MENU' }} ]
      </div>
    </div>
  </nav>

  <!-- Fullscreen Menu -->
  <transition
    enter-active-class="transition-opacity duration-500 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-show="isOpen" class="fixed inset-0 z-40 bg-apple-black flex flex-col items-center justify-center font-mono overflow-hidden">
      <!-- Scanline background -->
      <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px] opacity-100 z-0"></div>
      
      <!-- List Links -->
      <div class="relative z-10 flex flex-col gap-6 md:gap-10 text-3xl md:text-5xl text-white font-light tracking-wide w-full max-w-2xl px-12 uppercase" id="menu-container">
        
        <router-link to="/about" @click="isOpen = false" class="group flex items-center hover:text-apple-neon transition-colors duration-300 w-fit">
           <span class="opacity-0 -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mr-4 font-bold">>_</span>
           <span class="group-hover:translate-x-4 transition-transform duration-300">/ ABOUT</span>
        </router-link>
        
        <router-link to="/modules" @click="isOpen = false" class="group flex items-center hover:text-apple-neon transition-colors duration-300 w-fit">
           <span class="opacity-0 -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mr-4 font-bold">>_</span>
           <span class="group-hover:translate-x-4 transition-transform duration-300">/ MODULES</span>
        </router-link>
        
        <router-link to="/logs" @click="isOpen = false" class="group flex items-center hover:text-apple-neon transition-colors duration-300 w-fit">
           <span class="opacity-0 -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mr-4 font-bold">>_</span>
           <span class="group-hover:translate-x-4 transition-transform duration-300">/ LOGS</span>
        </router-link>

        <router-link to="/contact" @click="isOpen = false" class="group flex items-center hover:text-apple-neon transition-colors duration-300 w-fit">
           <span class="opacity-0 -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mr-4 font-bold">>_</span>
           <span class="group-hover:translate-x-4 transition-transform duration-300">/ CONTACT</span>
        </router-link>

        <router-link to="/shop" @click="isOpen = false" class="group flex items-center hover:text-apple-neon transition-colors duration-300 w-fit">
           <span class="opacity-0 -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mr-4 font-bold">>_</span>
           <span class="group-hover:translate-x-4 transition-transform duration-300 border-l border-apple-neon pl-4">/ SHOP</span>
        </router-link>

      </div>
    </div>
  </transition>
</template>

<style scoped>
#menu-container a {
   text-shadow: 0 0 10px rgba(0,0,0,0.5);
}
</style>
