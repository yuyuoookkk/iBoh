<script setup lang="ts">
import { onMounted } from 'vue';

const stats = [
  { label: 'CORES', value: '16', unit: '' },
  { label: 'BANDWIDTH', value: '400', unit: 'GB/s' },
  { label: 'TERAFLOPS', value: '31.4', unit: '' },
  { label: 'DISPLAY NITS', value: '1600', unit: 'max' },
];

const logs = [
  { id: 'usr_0x9A', time: '14:02:44', msg: 'Neural engine processing optimized for complex workflows.' },
  { id: 'usr_0x2C', time: '15:11:09', msg: 'Thermal envelope maintained during sustained high load.' },
  { id: 'usr_0x7F', time: '16:45:22', msg: 'Unparalleled performance rendering core nodes in real-time.' },
];

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

      <!-- Diagnostics / Stats -->
      <section class="py-16 pb-32 border-b border-apple-neon/10">
         <h2 class="text-xs tracking-widest text-apple-neon uppercase mb-16 flex items-center gap-4">
          <span class="w-1 h-3 bg-apple-neon inline-block"></span>
          Performance Metrics_
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 relative text-center">
            <!-- Scanline sweeping over stats -->
            <div class="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,255,65,0.05)_50%,transparent_100%)] bg-[length:100%_200%] animate-[scan_4s_linear_infinite] pointer-events-none z-10"></div>
            
            <div v-for="stat in stats" :key="stat.label" class="border border-apple-neon/20 p-8 flex flex-col justify-center items-center relative overflow-hidden bg-black/50">
                <div class="text-4xl md:text-6xl text-white mb-2 font-sans font-light tabular-nums">
                  {{ stat.value }}<span class="text-apple-neon text-2xl">{{ stat.unit }}</span>
                </div>
                <div class="text-xs tracking-[0.2em] text-apple-gray">{{ stat.label }}</div>
            </div>
        </div>
      </section>

      <!-- Logs / Testimonials -->
      <section class="py-32 border-b border-apple-neon/10">
        <h2 class="text-xs tracking-widest text-apple-neon uppercase mb-16 flex items-center gap-4">
          <span class="w-1 h-3 bg-apple-neon inline-block"></span>
          System Logs_
        </h2>
        <div class="flex flex-col gap-4 max-w-3xl">
           <div v-for="log in logs" :key="log.id" class="flex flex-col md:flex-row gap-4 md:items-center bg-black/40 border-l-2 border-apple-neon p-6 hover:bg-apple-neon/5 transition-colors cursor-default">
              <div class="flex gap-4 md:w-48 text-xs text-apple-gray whitespace-nowrap opacity-70">
                 <span>[{{ log.time }}]</span>
                 <span class="text-apple-neon">{{ log.id }}</span>
              </div>
              <p class="text-sm md:text-base flex-1">"{{ log.msg }}"</p>
           </div>
        </div>
      </section>
    </div>
  </div>
</template>
