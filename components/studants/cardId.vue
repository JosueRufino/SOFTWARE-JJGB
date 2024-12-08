<template>
  <div class="card text-center border-0" style="width: 15rem">
    <img
      :src="studant?.imagem"
      v-if="studant && studant.imagem"
      class="rounded-circle mx-auto mt-2"
      alt="User avatar"
      style="width: 100px; height: 100px"
    />
    <!-- Conteúdo do Card -->
    <div class="card-body">
      <h5 class="card-title">{{ studant?.nome }}</h5>
      <p class="card-text mb-0">{{ studant?.matricula }}</p>
      <p class="text-decoration-none">
        {{ studant?.email }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  studant: Object,
});
</script>

<style scoped>
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  transform: scale(1.05);
}
</style>
