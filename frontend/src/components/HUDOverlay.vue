<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ progress: number }>();

// Boot State Opacity (0 to 0.25)
const bootOpacity = computed(() => {
  if (props.progress > 0.25) return 0;
  // Fade in 0->0.05, max at 0.05->0.20, fade out 0.20->0.25
  if (props.progress < 0.05) return props.progress / 0.05;
  if (props.progress < 0.20) return 1;
  return 1 - (props.progress - 0.20) / 0.05;
});

// Data Feed State Opacity (0.25 to 0.50)
const feedOpacity = computed(() => {
  if (props.progress < 0.25 || props.progress > 0.50) return 0;
  if (props.progress < 0.30) return (props.progress - 0.25) / 0.05;
  if (props.progress < 0.45) return 1;
  return 1 - (props.progress - 0.45) / 0.05;
});

// Analysis State Opacity (0.50 to 0.75)
const analysisOpacity = computed(() => {
  if (props.progress < 0.50 || props.progress > 0.75) return 0;
  if (props.progress < 0.55) return (props.progress - 0.50) / 0.05;
  if (props.progress < 0.70) return 1;
  return 1 - (props.progress - 0.70) / 0.05;
});

const ctaOpacity = computed(() => {
  if (props.progress < 0.75) return 0;
  return Math.min(1, (props.progress - 0.75) / 0.1);
});

// Mock dynamic signals based on progress
const signalStrength = computed(() => Math.floor(70 + (props.progress * 100) % 30));
const frameRate = computed(() => Math.floor(55 + (props.progress * 200) % 5));
const depthVal = computed(() => (1.2 + props.progress * 2).toFixed(2));
</script>

<template>
  <div class="absolute inset-0 pointer-events-none z-10 p-8 font-mono text-apple-neon flex flex-col justify-between overflow-hidden">
    <!-- UI Border Scanning -->
    <div class="absolute inset-4 border border-apple-neon/20 pointer-events-none mix-blend-screen"></div>
    <div class="absolute top-0 bottom-0 left-[20%] w-[1px] bg-apple-neon/5 hidden md:block"></div>
    <div class="absolute top-0 bottom-0 right-[20%] w-[1px] bg-apple-neon/5 hidden md:block"></div>
    
    <!-- 0-25%: BOOT -->
    <div class="absolute inset-0 flex items-center justify-center transition-opacity duration-300" :style="{ opacity: bootOpacity }">
      <div class="flex flex-col items-center">
        <span class="tracking-widest text-sm mb-4 bg-black/60 px-4 py-2 border border-apple-neon/50 shadow-[0_0_10px_rgba(0,255,65,0.3)]">
          [ SYSTEM ONLINE ]
        </span>
        <div class="w-48 h-[2px] bg-apple-neon/20 relative overflow-hidden">
          <div class="absolute left-0 top-0 bottom-0 bg-apple-neon" :style="{ width: `${(props.progress / 0.25) * 100}%` }"></div>
        </div>
      </div>
    </div>

    <!-- 25-50%: DATA FEED -->
    <div class="absolute inset-8 flex items-end justify-between transition-opacity duration-300 pointer-events-none text-xs tracking-widest leading-relaxed" :style="{ opacity: feedOpacity }">
      <div class="flex flex-col gap-2 bg-black/40 backdrop-blur-sm p-4 border border-apple-neon/20">
        <div>CORE CLOCK: <span class="text-white">4.0{{ frameRate }} GHz</span></div>
        <div>THERMAL: <span class="text-white">{{ depthVal }} °C</span></div>
        <div>EFFICIENCY: <span class="text-white">{{ signalStrength }}%</span></div>
      </div>
      <!-- Right Side Fake Hex Feed -->
      <div class="hidden md:flex flex-col text-right font-mono opacity-60 text-[10px] leading-tight">
        <div>0x00F1 // ESTABLISH</div>
        <div class="animate-pulse">0x0CA4 // BUFFER RECV</div>
        <div v-for="i in 5" :key="i">0x{{ Math.floor(Math.random() * 9999) }} // MAP LAYER {{ i }}</div>
      </div>
    </div>

    <!-- 50-75%: ANALYSIS MODE -->
    <div class="absolute inset-0 transition-opacity duration-300" :style="{ opacity: analysisOpacity }">
       <!-- Crosshair -->
       <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="relative w-32 h-32 border border-apple-neon/30 rounded-full flex items-center justify-center">
             <div class="w-10 h-[1px] bg-apple-neon/60 absolute"></div>
             <div class="h-10 w-[1px] bg-apple-neon/60 absolute"></div>
             <!-- Scanning Target Box -->
             <div class="absolute w-12 h-12 border border-apple-neon animate-pulse transition-transform duration-100"
                  :style="{ transform: `translate(${(props.progress - 0.6) * 100}px, ${(props.progress - 0.5) * -50}px) scale(1.2)` }"></div>
          </div>
       </div>
       <!-- Vertical Scanline -->
       <div class="absolute left-0 right-0 h-[30vh] bg-gradient-to-b from-transparent via-apple-neon/5 to-transparent border-b border-apple-neon/30"
            :style="{ top: `${((props.progress - 0.50) / 0.25) * 100}%` }">
       </div>
    </div>

    <!-- 75-100%: CTA FINAL STATE -->
    <div class="absolute inset-0 flex items-center justify-center transition-opacity duration-500 backdrop-blur-[2px] bg-black/20" :style="{ opacity: ctaOpacity, pointerEvents: ctaOpacity > 0.5 ? 'auto' : 'none' }">
        <div class="flex flex-col items-center gap-6">
          <div class="tracking-[0.5em] text-white text-xl">
             [ ANALYSIS COMPLETE ]
          </div>
          <!-- CTA Button with Hover Glow -->
          <router-link to="/about" class="inline-block relative group px-10 py-4 border border-apple-neon text-apple-neon font-mono uppercase tracking-widest text-sm overflow-hidden mix-blend-screen bg-black/50 backdrop-blur-sm cursor-pointer hover:bg-apple-neon hover:text-black hover:shadow-[0_0_20px_rgba(0,255,65,0.6)] transition-all duration-300">
            CONFIGURE SYSTEM
            <div class="absolute inset-0 bg-apple-neon opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </router-link>
        </div>
    </div>
    
  </div>
</template>
