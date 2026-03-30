<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useWindowScroll, useWindowSize } from '@vueuse/core';
import HUDOverlay from './HUDOverlay.vue';

const canvas = ref<HTMLCanvasElement | null>(null);
const container = ref<HTMLElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);

const { y } = useWindowScroll();
const { width, height } = useWindowSize();

const totalFrames = 270;
const images = ref<HTMLImageElement[]>([]);
const currentFrame = ref(1);

// HUD state (0.0 to 1.0 representing scroll percentage over THIS container)
const localProgress = ref(0);

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d');
    
    // Set initial size
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;

    // Load images array from browser cache (already loaded by Preloader)
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameIndex = i.toString().padStart(3, '0');
      img.src = `/sequence/ezgif-frame-${frameIndex}.jpg`;
      images.value.push(img);
    }

    // Draw first frame if it's already complete, else on load
    if (images.value[0].complete) {
        drawImage(images.value[0]);
    } else {
        images.value[0].onload = () => drawImage(images.value[0]);
    }
  }
});

const drawImage = (img: HTMLImageElement) => {
  if (!ctx.value || !canvas.value) return;
  const cWidth = canvas.value.width;
  const cHeight = canvas.value.height;

  // Contain equivalent
  const ratio = Math.min(cWidth / img.width, cHeight / img.height);
  const w = img.width * ratio;
  const h = img.height * ratio;
  const offsetX = (cWidth - w) / 2;
  const offsetY = (cHeight - h) / 2;

  ctx.value.clearRect(0, 0, cWidth, cHeight);
  ctx.value.drawImage(img, offsetX, offsetY, w, h);
};

// Handle window resize dynamically
watch([width, height], () => {
    if (canvas.value) {
        canvas.value.width = width.value;
        canvas.value.height = height.value;
        if(images.value[currentFrame.value - 1]) {
            drawImage(images.value[currentFrame.value - 1]);
        }
    }
});

watch(y, (newY) => {
   if (!container.value) return;
   
   const rect = container.value.getBoundingClientRect();
   const containerTop = rect.top + window.scrollY;
   const scrollPos = newY - containerTop;
   // Max scroll distance is container height minus window height
   const maxScroll = container.value.clientHeight - window.innerHeight;
   
   let fraction = scrollPos / maxScroll;
   fraction = Math.min(Math.max(fraction, 0), 1);
   localProgress.value = fraction;

   const frame = Math.floor(fraction * (totalFrames - 1)) + 1;
   
   if (frame !== currentFrame.value) {
     currentFrame.value = frame;
     const img = images.value[frame - 1];
     if (img) drawImage(img);
   }
});
</script>

<template>
  <div ref="container" class="relative w-full h-[500vh]">
    <!-- Sticky Canvas -->
    <div class="sticky top-0 w-full h-screen overflow-hidden z-0">
      <canvas ref="canvas" class="w-full h-full object-cover"></canvas>
      
      <!-- Overlay System HUD -->
      <HUDOverlay :progress="localProgress" />
    </div>
  </div>
</template>
