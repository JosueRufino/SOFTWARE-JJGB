<template>
  <div :id="chartId" :style="{ width: width, height: height }"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    chartId: {
      type: String,
      default: "echart",
    },
    width: {
      type: String,
      default: "600px",
    },
    height: {
      type: String,
      default: "400px",
    },
    options: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.chart = echarts.init(document.getElementById(this.chartId));
    this.chart.setOption(this.options);
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
};
</script>
