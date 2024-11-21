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
    default: "pieChart",
  },
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "400px",
  },
  data: {
    type: Array,
    default: () => [
      { value: 1048, name: "Search Engine" },
      { value: 735, name: "Direct" },
      { value: 580, name: "Email" },
      { value: 484, name: "Union Ads" },
      { value: 300, name: "Video Ads" },
    ],
  },
});

let chart;

const option = {
  title: {
    text: "Referer of a Website",
    subtext: "Fake Data",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: "50%",
      data: props.data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
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
/* Garante que o gráfico ocupe 100% da largura disponível */
#pieChart {
  width: 100%;
  height: 400px;
}
</style>
