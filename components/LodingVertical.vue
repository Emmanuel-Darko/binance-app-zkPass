<script setup lang="ts">
defineProps({
  size: { default: '40', type: String || Number },
  color: { default: '#4B5563', type: String },
  speed: { default: '0.8s', type: String },
});
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fill-rule="evenodd">
      <rect :fill="color" x="10" y="15" width="5" height="20">
        <animate attributeName="height" values="20; 30; 20" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="y" values="15; 10; 15" dur="0.8s" repeatCount="indefinite" />
      </rect>
      <rect :fill="color" x="22" y="15" width="5" height="20">
        <animate attributeName="height" values="20; 30; 20" dur="0.8s" begin="0.2s" repeatCount="indefinite" />
        <animate attributeName="y" values="15; 10; 15" dur="0.8s" begin="0.2s" repeatCount="indefinite" />
      </rect>
      <rect :fill="color" x="34" y="15" width="5" height="20">
        <animate attributeName="height" values="20; 30; 20" dur="0.8s" begin="0.4s" repeatCount="indefinite" />
        <animate attributeName="y" values="15; 10; 15" dur="0.8s" begin="0.4s" repeatCount="indefinite" />
      </rect>
    </g>
  </svg>
</template>
