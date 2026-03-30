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
          Silicon Architecture_
        </h2>
        <div class="text-2xl md:text-5xl font-sans font-light leading-snug max-w-4xl tracking-tight mb-8">
          <p class="mb-4 text-white">M-Class Silicon Architecture.</p>
          <p class="text-apple-gray">Mind-blowing performance. Unparalleled power efficiency. Designed to redefine boundaries.</p>
        </div>
        <p class="text-apple-gray max-w-3xl leading-relaxed mt-16 font-mono tracking-wide">
            Designed to push the absolute limits of computational physics, this proprietary Neural Architecture allows users to run massive parameter models locally, rendering the impossible possible. The core integrates seamlessly into every sub-routine, ensuring thermal envelopes are never breached and latency remains near zero.
        </p>
      </section>
    </div>
  </div>
</template>
