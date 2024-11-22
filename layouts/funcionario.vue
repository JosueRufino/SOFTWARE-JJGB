<template>
  <div class="dashboard-container">
    <div class="sidebar">
      <!-- Conteúdo da sidebar -->
      <Sidebar />
    </div>
    <div class="main-content">
      <div>
        <Navbar />
      </div>
      <div class="content">
        <!-- Conteúdo principal do dashboard -->
        <h5 class="fw-bold" v-if="route.path === '/funcionario'">Bem-vindo ao Dashboard!</h5>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  background-color: #f2f2f2;
  gap: 20px; /* Espaçamento entre sidebar e conteúdo */
  overflow: hidden;
}

.sidebar {
  background-color: white;
  border-radius: 8px;
  height: 100%;
  flex-shrink: 0; /* Impede que a sidebar encolha */
  width: 250px; /* Tamanho fixo ou ajustável */
  overflow-y: auto; /* Adiciona rolagem se o conteúdo for maior que a tela */
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.content {
  height: 80vh;
  overflow-y: auto;
  border-radius: 8px;
  flex-grow: 1;
}
</style>
