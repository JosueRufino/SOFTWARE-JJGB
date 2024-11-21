<template>
  <div
    class="card d-flex flex-column justify-content-between align-items-start p-4 border-0"
    style=" background: linear-gradient(135deg, #2596be, #33b5e5); border-radius: 10px; color: white"
  >
    <!-- Ícone e título -->
    <div>
      <i class="bi bi-book-fill fs-3"></i><br />
      <span style="font-size: 1rem; font-weight: 500">{{ title }}</span>
    </div>

    <!-- Contador -->
    <div class="align-self-end" style="font-size: 1.5rem; font-weight: bold">
      {{ count }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "Livros",
  },
  count: {
    type: Number,
    default: 0,
  },
});
</script>
