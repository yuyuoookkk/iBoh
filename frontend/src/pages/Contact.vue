<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
    window.scrollTo(0,0);
});
</script>

<template>
  <div class="w-full min-h-screen bg-apple-black text-apple-light relative overflow-x-hidden pt-32 pb-16">
    <div class="pointer-events-none absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] mix-blend-overlay z-0"></div>

    <div class="max-w-7xl mx-auto px-6 font-mono font-light relative z-10">
      <div class="absolute top-0 bottom-0 left-6 w-[1px] bg-apple-neon/10 pointer-events-none"></div>
      <div class="absolute top-0 bottom-0 right-6 w-[1px] bg-apple-neon/10 pointer-events-none"></div>

      <!-- Command Mode Final CTA -->
      <section class="py-48 flex flex-col items-center justify-center relative overflow-hidden text-center min-h-[70vh]">
         <!-- Glitch bg element -->
         <div class="absolute inset-0 bg-apple-neon/5 opacity-50 backdrop-blur-3xl animate-pulse pointer-events-none"></div>
         
         <div class="text-[10px] tracking-[0.4em] text-apple-neon mb-8">SYSTEM ARCHITECTURE READY</div>
         
         <router-link to="/shop" class="block px-16 py-6 border-2 border-apple-neon text-apple-neon font-bold tracking-widest text-lg hover:bg-apple-neon hover:text-black transition-all duration-300 shadow-[0_0_30px_rgba(0,255,65,0.2)] hover:shadow-[0_0_60px_rgba(0,255,65,0.6)] cursor-crosshair">
           [ ACCESS SHOP CORE ]
         </router-link>

         <div class="mt-24 text-apple-gray text-xs tracking-widest uppercase flex flex-col items-center gap-4">
            <p>Direct Interface Portal:</p>
            <a href="mailto:sys@apple.com" class="text-white hover:text-apple-neon transition-colors">sys@apple.com</a>
         </div>
      </section>

    </div>
  </div>
</template>
