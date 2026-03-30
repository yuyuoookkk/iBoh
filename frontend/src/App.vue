<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Lenis from 'lenis';
import Preloader from './components/Preloader.vue';
import Navbar from './components/Navbar.vue';

const isLoaded = ref(false);
let lenis: Lenis;

onMounted(() => {
  // Initialize Lenis for buttery smooth scrolling
  lenis = new Lenis({
    lerp: 0.08,
    wheelMultiplier: 0.8,
    // smoothWheel removed in newer Lenis versions, it handles it automatically
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
});

onUnmounted(() => {
  if (lenis) lenis.destroy();
});

// Once loaded, scroll to top just in case
const handleComplete = () => {
   window.scrollTo(0,0);
   isLoaded.value = true;
};
</script>

<template>
  <div class="bg-black min-h-screen text-apple-light antialiased w-full max-w-[100vw]">
    <!-- Static Grain Overlay Globally -->
    <div class="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-screen overflow-hidden">
       <div class="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] shrink-0 min-w-[200vw] min-h-[200vh] animate-[grain_8s_steps(10)_infinite]"></div>
    </div>

    <!-- Preloader -->
    <transition
      leave-active-class="transition-all duration-1000 ease-in-out"
      leave-from-class="opacity-100 scale-100 filter-none"
      leave-to-class="opacity-0 scale-110 blur-xl"
    >
      <Preloader v-if="!isLoaded" @complete="handleComplete" />
    </transition>
    
    <Navbar />

    <main class="relative" :class="isLoaded ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'">
      <router-view />
    </main>
  </div>
</template>

<style>
@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -10%); }
  20% { transform: translate(-15%, 5%); }
  30% { transform: translate(7%, -25%); }
  40% { transform: translate(-5%, 25%); }
  50% { transform: translate(-15%, 10%); }
  60% { transform: translate(15%, 0%); }
  70% { transform: translate(0%, 15%); }
  80% { transform: translate(3%, 35%); }
  90% { transform: translate(-10%, 10%); }
}

* {
  cursor: crosshair !important;
}
</style>
