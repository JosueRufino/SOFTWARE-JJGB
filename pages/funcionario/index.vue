<template>
  <div>
    <!-- Seção de Cards -->
    <div class="text-center">
      <div class="row gx-3">
        <!-- Usando gx-3 para espaçamento adequado -->
        <div class="col-12 col-md-3" v-for="i in 4" :key="i">
          <div class="p-1"><DashboardCard title="Livros" :count="15" /></div>
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
