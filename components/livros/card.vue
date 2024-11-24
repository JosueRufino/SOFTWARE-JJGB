<template>
  <div class="card border-0 p-0" style="width: 12rem">
    <div
      class="w-50 p-1 position-absolute text-white text-center"
      :class="book.status ? 'bg-success' : 'bg-danger'"
    >
      {{ book.status ? "Disponível" : "Indisponível" }}
    </div>
    <div class="p-3">
      <img
        :src="book.imagem ? book.imagem : '/assets/book3.png'"
        style="max-height: 200px; width: 100%; background-size: cover"
        alt="..."
      />
      <div class="mt-2">
        <h5 class="card-title">{{ book.titulo }}</h5>
        <p class="text-secondary mb-1">Autor: {{ book.autor }}</p>
      </div>
      <div class="d-flex justify-content-between mt-2">
        <button class="btn btn-primary">
          <i class="bi bi-eye-fill"></i>
        </button>
        <button class="btn btn-secondary">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-danger">
          <i class="bi bi-trash-fill"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  book: Object,
});
</script>
