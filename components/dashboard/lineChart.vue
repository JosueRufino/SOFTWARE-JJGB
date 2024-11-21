<template>
  <div :id="chartId" :style="{ width: width, height: height }"></div>
</template>

<script setup>
import * as echarts from "echarts";
import { onMounted, onBeforeUnmount } from "vue";

// Props recebidas
const props = defineProps({
  chartId: {
    type: String,
    default: "lineChart",
  },
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "100%",
  },
  data: {
    type: Array,
    default: () => [
      { date: "01/11", value: 5 },
      { date: "02/11", value: 15 },
      { date: "03/11", value: 20 },
      { date: "04/11", value: 10 },
    ],
  },
});

let chart;

const option = {
  title: {
    text: "Frequência de Empréstimos de Livros ao Longo do Tempo",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: props.data.map((item) => item.date), // Datas ou meses
  },
  yAxis: {},
  series: [
    {
      name: "Livros Emprestados",
      type: "line",
      data: props.data.map((item) => item.value), // Quantidade de empréstimos
      smooth: true,
      lineStyle: {
        width: 2,
        color: "#42a5f5",
      },
    },
  ],
};

onMounted(() => {
  chart = echarts.init(document.getElementById(props.chartId));
  chart.setOption(option);
});

onBeforeUnmount(() => {
  if (chart) {
    chart.dispose();
  }
});
</script>

<style scoped>
#lineChart {
  width: 100%;
  height: 400px;
}
</style>
