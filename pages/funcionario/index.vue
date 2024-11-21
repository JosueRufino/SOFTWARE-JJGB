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
    <div class="card p-3 w-100">
      <DashboardBarChart
        class="w-100"
        chart-id="responsiveChart"
        :width="'100%'"
        :height="'400px'"
        :options="chartOptions"
      />
    </div>

    <!-- Outras Colunas -->
    <div class="row w-100 p-3">
      <div class="col-12 col-md-6 card p-5">
        <DashboardPizzaChart
          chart-id="pieChart"
          :width="'100%'"
          :height="'400px'"
          :data="chartData"
        />
      </div>
      <div class="col-12 col-md-6 card"><DashboardLineChart/></div>
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
    text: "Exemplo de ECharts",
  },
  tooltip: {},
  legend: {
    data: ["Vendas"],
  },
  xAxis: {
    data: ["Camisas", "Cardigans", "Chiffons", "Calças", "Saltos", "Meias"],
  },
  yAxis: {},
  series: [
    {
      name: "Vendas",
      type: "bar",
      data: [5, 20, 36, 10, 10, 20],
    },
  ],
});

// Dados para o gráfico
const chartData = reactive([
  { value: 1048, name: "Search Engine" },
  { value: 735, name: "Direct" },
  { value: 580, name: "Email" },
  { value: 484, name: "Union Ads" },
  { value: 300, name: "Video Ads" },
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
