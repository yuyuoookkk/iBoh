<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits(['complete'])
const progress = ref(0)
const loadText = ref('SYSTEM BOOT INITIALIZING...')

onMounted(async () => {
  const totalFrames = 270;
  let loaded = 0;

  const promises = Array.from({ length: totalFrames }, (_, i) => {
    return new Promise((resolve) => {
      const img = new Image();
      const frameIndex = (i + 1).toString().padStart(3, '0');
      
      const handleLoad = () => {
        loaded++;
        progress.value = Math.floor((loaded / totalFrames) * 100);
        
        if (progress.value < 30) loadText.value = 'FETCHING VISUAL DATA...'
        else if (progress.value < 60) loadText.value = 'BUILDING NEURAL MAP...'
        else if (progress.value < 90) loadText.value = 'COMPILING SCENE ASSETS...'
        else loadText.value = 'VERIFYING INTEGRITY...'

        resolve(true);
      };

      img.onload = handleLoad;
      img.onerror = handleLoad; // Skip errors without hanging
      img.src = `/sequence/ezgif-frame-${frameIndex}.jpg`;
    });
  });

  await Promise.all(promises);

  loadText.value = 'SYSTEM READY.';
  // Small delay for the user to see 100%
  setTimeout(() => {
    emit('complete');
  }, 800);
});
</script>

<template>
  <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-apple-black text-apple-neon font-mono">
    <!-- Grain overlay -->
    <div class="pointer-events-none absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] mix-blend-overlay"></div>
    
    <div class="relative w-72 md:w-96">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs uppercase tracking-widest flex items-center gap-2">
          <span class="w-2 h-2 bg-apple-neon animate-pulse"></span>
          {{ loadText }}
        </span>
      </div>
      
      <!-- Segmented Bar -->
      <div class="h-[2px] w-full bg-apple-dark/50 relative overflow-hidden flex gap-[1px]">
        <div class="absolute top-0 left-0 bottom-0 bg-apple-neon transition-all duration-75" :style="{ width: `${progress}%` }"></div>
      </div>
      
      <div class="mt-3 text-xs flex justify-between opacity-70">
        <span class="animate-pulse">>_</span>
        <span>{{ progress.toString().padStart(3, '0') }}%</span>
      </div>
    </div>
  </div>
</template>
