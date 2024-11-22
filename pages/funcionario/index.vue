<template>
  <div>
    <!-- Seção de Cards -->
    <div class="text-center">
      <div class="row gx-1">
        <!-- Usando gx-3 para espaçamento adequado -->
        <div class="col-12 col-md-3" v-for="(data, i) in dataCards" :key="i">
          <div class="p-1"><DashboardCard :data="data" /></div>
        </div>
      </div>
    </div>

    <!-- Gráfico -->
    <div class="card p-3 w-100 mt-4">
      <DashboardBarChart
        class="w-100"
        chart-id="responsiveChart"
        :width="'100%'"
        :height="'400px'"
        :options="chartOptions"
      />
    </div>

    <div class="w-100 mt-3">
      <div class="p-3 card">
        <DashboardPizzaChart
          chart-id="pieChart"
          :width="'100%'"
          :height="'400px'"
          :data="chartData"
        />
      </div>
    </div>
    <div class="w-100 mt-3">
      <div class="p-3 card">
        <DashboardLineChart />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "funcionario",
});

import { reactive } from "vue";

const dataCards = [
  {
    name: "Livros",
    icon: "bi bi-book-fill",
    value: 15,
  },
  {
    name: "Funcionários",
    icon: "bi bi-file-person-fill",
    value: 15,
  },
  {
    name: "Estudantes",
    icon: "bi bi-person",
    value: 15,
  },
  {
    name: "Categorias",
    icon: "bi bi-bookmark-check-fill",
    value: 15,
  },
  {
    name: "Subcategorias",
    icon: "bi bi-tags-fill",
    value: 15,
  },
  {
    name: "Lista de espera",
    icon: "bi bi-card-checklist",
    value: 15,
  },
  {
    name: "Livros emprestados",
    icon: "bi bi-list-check",
    value: 15,
  },
  {
    name: "Notificações",
    icon: "bi bi-bell-fill",
    value: 15,
  },
];



// Definindo as opções do gráfico
const chartOptions = reactive({
  title: {
    text: "Estatistica geral",
  },
  tooltip: {},
  legend: {
    data: ["Geral"],
  },
  xAxis: {
    data: [
      "Funcionários",
      "Estudantes",
      "Livros",
      "Lista de espera",
      "Livros emprestados",
    ],
  },
  yAxis: {},
  series: [
    {
      name: "Geral",
      type: "bar",
      data: [5, 20, 36, 10, 10],
    },
  ],
});

// Dados para o gráfico
const chartData = reactive([
  { value: 1048, name: "Funcionários" },
  { value: 735, name: "Estudantes" },
  { value: 580, name: "Livros" },
  { value: 484, name: "Lista de espera" },
  { value: 300, name: "Livros emprestados" },
]);
</script>

<style scoped>
/* Evitar o scroll-x */
body,
.container,
.row {
  overflow-x: hidden; /* Impede o scroll horizontal */
  width: 100%; /* Garante que a largura do container não ultrapasse a tela */
}

.card {
  /* Ajustando o layout das colunas */
  flex-grow: 1; /* Para que as colunas cresçam igualmente */
}

.text-center {
  overflow-x: hidden; /* Evita qualquer conteúdo excedente horizontal */
}

.w-100 {
  max-width: 100%; /* Limita a largura ao tamanho do contêiner */
}
</style>
