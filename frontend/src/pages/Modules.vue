<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
    window.scrollTo(0,0);
});
</script>

<template>
  <div class="w-full min-h-screen bg-apple-black text-apple-light relative overflow-x-hidden pt-32 pb-16">
    <div class="pointer-events-none absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] mix-blend-overlay"></div>

    <div class="max-w-7xl mx-auto px-6 font-mono font-light relative z-10">
      <div class="absolute top-0 bottom-0 left-6 w-[1px] bg-apple-neon/10 pointer-events-none"></div>
      <div class="absolute top-0 bottom-0 right-6 w-[1px] bg-apple-neon/10 pointer-events-none"></div>

      <section class="py-16 md:py-32">
        <h2 class="text-xs tracking-widest text-apple-neon uppercase mb-16 flex items-center gap-4">
          <span class="w-1 h-3 bg-apple-neon inline-block animate-pulse"></span>
          Core Subsystems_
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div v-for="i in 3" :key="i" class="group relative aspect-[3/4] border border-apple-neon/20 overflow-hidden cursor-crosshair bg-apple-dark">
              <!-- Parallax bg mockup -->
              <img :src="`/sequence/ezgif-frame-${(i * 50).toString().padStart(3, '0')}.jpg`" 
                   class="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 ease-out z-0 filter contrast-125" alt="module" />
              
              <!-- HUD details -->
              <div class="absolute inset-4 border border-apple-neon/10 mix-blend-screen pointer-events-none z-10 transition-colors group-hover:border-apple-neon/40"></div>
              
              <div class="relative z-20 p-6 flex flex-col justify-between h-full bg-gradient-to-t from-apple-black to-transparent">
                <div class="text-xs bg-black/80 w-fit px-3 py-1 text-apple-neon border border-apple-neon shadow-[0_0_15px_rgba(0,255,65,0.2)] tracking-widest">
                  {{ ['NEURAL ENGINE', 'GPU ARCHITECTURE', 'THERMAL ARRAY'][i-1] }}
                </div>
                <div>
                  <router-link to="/contact" class="block text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-500 delay-100 bg-apple-neon text-black font-bold p-2 inline-block shadow-[0_0_20px_rgba(0,255,65,0.5)]">
                    Explore deeper >
                  </router-link>
                </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  </div>
</template>
