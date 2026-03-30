<script setup lang="ts">
import SequenceScroll from '../components/SequenceScroll.vue';

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
]
</script>

<template>
  <div class="relative w-full">
    <SequenceScroll />
    
    <div class="relative z-10 w-full min-h-screen bg-apple-black -mt-[100vh] text-apple-light border-y border-apple-neon/30">
      <!-- Spacer matching the canvas container final view -->
      <div class="h-screen w-full pointer-events-none bg-black/80 backdrop-blur-sm border-b border-apple-neon grid place-items-center relative">
         <div class="text-[10px] tracking-[0.4em] text-apple-neon absolute bottom-24 animate-pulse">
           SYSTEM INITIALIZED. SCROLL TO PROCEED.
         </div>
      </div> 

      <!-- Noise overlay -->
      <div class="pointer-events-none absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] mix-blend-overlay"></div>

      <div class="max-w-7xl mx-auto px-6 py-24 font-mono font-light relative">
        
        <!-- Vertical scanlines for aesthetic -->
        <div class="absolute top-0 bottom-0 left-6 w-[1px] bg-apple-neon/10 pointer-events-none"></div>
        <div class="absolute top-0 bottom-0 right-6 w-[1px] bg-apple-neon/10 pointer-events-none"></div>

        <!-- About / System Overview -->
        <section id="about" class="py-32 border-b border-apple-neon/10 relative">
          <h2 class="text-xs tracking-widest text-apple-neon uppercase mb-16 flex items-center gap-4">
            <span class="w-1 h-3 bg-apple-neon inline-block animate-pulse"></span>
            Silicon Architecture_
          </h2>
          <div class="text-2xl md:text-5xl font-sans font-light leading-snug max-w-4xl tracking-tight mb-8">
            <p class="mb-4 text-white">M-Class Silicon Architecture.</p>
            <p class="text-apple-gray">Mind-blowing performance. Unparalleled power efficiency. Designed to redefine boundaries.</p>
          </div>
          <router-link to="/about" class="text-sm tracking-widest uppercase hover:text-apple-neon transition-colors duration-300 border-b border-apple-neon/30 pb-1">
            Read Full Specs >
          </router-link>
        </section>

        <!-- Modules Array -->
        <section id="modules" class="py-32 border-b border-apple-neon/10">
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
                    <router-link to="/modules" class="block text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-500 delay-100 bg-apple-neon text-black font-bold p-2 inline-block shadow-[0_0_20px_rgba(0,255,65,0.5)]">
                      Explore deeper >
                    </router-link>
                  </div>
                </div>
             </div>
          </div>
        </section>

        <!-- Diagnostics / Stats -->
        <section class="py-32 border-b border-apple-neon/10">
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
        <section id="logs" class="py-32 border-b border-apple-neon/10">
          <div class="flex justify-between items-end mb-16">
            <h2 class="text-xs tracking-widest text-apple-neon uppercase flex items-center gap-4">
              <span class="w-1 h-3 bg-apple-neon inline-block"></span>
              System Logs_
            </h2>
            <router-link to="/logs" class="text-xs tracking-widest text-apple-gray hover:text-apple-neon transition-colors duration-300">
               VIEW FULL LOGS >
            </router-link>
          </div>
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

        <!-- Command Mode Final CTA -->
        <section id="contact" class="py-48 flex flex-col items-center justify-center relative overflow-hidden text-center">
           <!-- Glitch bg element -->
           <div class="absolute inset-0 bg-apple-neon/5 opacity-50 backdrop-blur-3xl animate-pulse pointer-events-none"></div>
           
           <div class="text-[10px] tracking-[0.4em] text-apple-neon mb-8">SYSTEM ARCHITECTURE READY</div>
           
           <router-link to="/shop" class="block px-16 py-6 border-2 border-apple-neon text-apple-neon font-bold tracking-widest text-lg hover:bg-apple-neon hover:text-black transition-all duration-300 shadow-[0_0_30px_rgba(0,255,65,0.2)] hover:shadow-[0_0_60px_rgba(0,255,65,0.6)] cursor-crosshair">
             [ ACCESS SHOP CORE ]
           </router-link>
        </section>

      </div>

      <!-- Minimal System Footer -->
      <footer class="border-t border-apple-neon/20 p-8 font-mono text-xs flex flex-col md:flex-row justify-between items-center text-apple-gray tracking-widest bg-black relative z-10">
          <div class="mb-4 md:mb-0">iBoh - VERSION 3.1.4</div>
          <div class="flex gap-6">
             <router-link to="/about" class="hover:text-apple-neon hover:underline underline-offset-4">/ABOUT</router-link>
             <router-link to="/modules" class="hover:text-apple-neon hover:underline underline-offset-4">/MODULES</router-link>
             <router-link to="/contact" class="hover:text-apple-neon hover:underline underline-offset-4">/CONTACT</router-link>
          </div>
          <div class="mt-4 md:mt-0 text-apple-neon/50">BUILD: {{ new Date().toISOString().split('T')[0] }}</div>
      </footer>
    </div>
  </div>
</template>

<style>
@keyframes scan {
  from { background-position: 0 0; }
  to { background-position: 0 100%; }
}
</style>
