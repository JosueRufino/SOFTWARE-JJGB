<template>
  <div
    class="card d-flex flex-column justify-content-between align-items-start p-4 border-0"
    style=" background: linear-gradient(135deg, #2596be, #33b5e5); border-radius: 10px; color: white"
  >
    <!-- Ícone e título -->
    <div class="text-start">
      <i class=" fs-3" :class="data.icon"></i><br />
      <span style="font-size: 1rem; font-weight: 500">{{ data.name }}</span>
    </div>

    <!-- Contador -->
    <div class="align-self-end" style="font-size: 1.5rem; font-weight: bold">
      {{ data.value }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
  },
});
</script>
